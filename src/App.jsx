import { createSignal, createEffect, onMount, onCleanup, For, Show, createMemo } from 'solid-js';
import * as d3 from 'd3';
import { LEVERS, LEVER_CATEGORIES, KARDASHEV_SCALE, SCENARIOS, INFO_TABS } from './data/content';
import { AI_HISTORY, CATEGORY_COLORS } from './data/history';
import {
  calculateTimeline,
  generateMilestones,
  determineScenario,
  formatYear,
  getTimeRemaining
} from './utils/timelineCalculator';
import { throttle } from './utils/helpers';
import ShareButton from './components/ShareButton';

function App() {
  // State - Initialize with 'race' scenario presets
  const [levers, setLevers] = createSignal({ ...SCENARIOS.race.presets });
  const [timeline, setTimeline] = createSignal({ agiYear: 2027, superYear: 2035, asiYear: 2043 });
  const [scenario, setScenario] = createSignal('race');
  const [showLearn, setShowLearn] = createSignal(false);
  const [activeTab, setActiveTab] = createSignal('singularity');
  const [selectedScenario, setSelectedScenario] = createSignal('race');
  const [showHistory, setShowHistory] = createSignal(false);
  const [historyFilter, setHistoryFilter] = createSignal('all');
  const [hoveredEvent, setHoveredEvent] = createSignal(null);

  let svgRef;
  let graphInitialized = false;

  // Memoized calculations to prevent unnecessary re-renders
  const calculatedTimeline = createMemo(() => {
    const currentLevers = levers();
    return calculateTimeline(currentLevers);
  });

  const determinedScenario = createMemo(() => {
    return determineScenario(levers());
  });

  const trajectoryData = createMemo(() => {
    const tl = calculatedTimeline();
    return computeTrajectory(tl);
  });

  const milestones = createMemo(() => {
    const tl = calculatedTimeline();
    return generateMilestones(tl.agiYear, tl.superYear, tl.asiYear);
  });

  // Update state when calculations change
  createEffect(() => {
    const tl = calculatedTimeline();
    setTimeline(tl);
    setScenario(determinedScenario());

    if (graphInitialized) {
      updateGraph(tl);
    }
  });

  onMount(() => {
    initGraph();
    window.addEventListener('resize', throttle(handleResize, 150));
  });

  onCleanup(() => {
    window.removeEventListener('resize', throttle(handleResize, 150));
  });

  // Throttled resize handler
  const handleResize = throttle(() => {
    if (svgRef) initGraph();
  }, 150);

  // Simple quadratic curve: y = x² (normalized)
  // This models exponential-like growth where progress accelerates
  function computeTrajectory(tl) {
    const currentYear = 2025.95;
    const singularityYear = tl.asiYear + 3; // Singularity ~3 years after ASI
    const points = [];

    // Starting capability (current)
    const startY = 0.12;
    // End capability (singularity)
    const endY = 0.95;

    // Generate points using quadratic: y = a*t² + b*t + c
    // Where t is normalized time from 0 (now) to 1 (singularity)
    for (let year = currentYear; year <= singularityYear; year += 0.3) {
      const t = (year - currentYear) / (singularityYear - currentYear);
      // Quadratic: y = startY + (endY - startY) * t²
      const y = startY + (endY - startY) * t * t;
      points.push({ x: year, y: Math.min(y, 0.99) });
    }

    return points;
  }

  // Calculate singularity year (shortly after ASI)
  function getSingularityYear(asiYear) {
    return asiYear + 3;
  }

  function initGraph() {
    if (!svgRef) return;

    const container = svgRef.parentElement;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Responsive margins - smaller on mobile where side panels are hidden
    const isMobile = width < 768;
    const isTablet = width >= 768 && width < 1024;
    const margin = isMobile
      ? { top: 40, right: 20, bottom: 60, left: 60 }
      : isTablet
        ? { top: 50, right: 40, bottom: 65, left: 80 }
        : { top: 60, right: 40, bottom: 70, left: 240 }; // Reduced right margin (no info panel)

    // Ensure dimensions are never negative to prevent SVG rendering errors
    const innerWidth = Math.max(100, width - margin.left - margin.right);
    const innerHeight = Math.max(100, height - margin.top - margin.bottom);

    d3.select(svgRef).selectAll('*').remove();

    const svg = d3.select(svgRef)
      .attr('width', width)
      .attr('height', height);

    const defs = svg.append('defs');

    // Gradient for trajectory
    const trajGradient = defs.append('linearGradient')
      .attr('id', 'trajGradient')
      .attr('gradientUnits', 'userSpaceOnUse');

    trajGradient.append('stop').attr('offset', '0%').attr('stop-color', '#22c55e');
    trajGradient.append('stop').attr('offset', '30%').attr('stop-color', '#00f0ff');
    trajGradient.append('stop').attr('offset', '60%').attr('stop-color', '#8b5cf6');
    trajGradient.append('stop').attr('offset', '100%').attr('stop-color', '#ec4899');

    // Glow filter
    const filter = defs.append('filter')
      .attr('id', 'glow')
      .attr('x', '-50%').attr('y', '-50%')
      .attr('width', '200%').attr('height', '200%');
    filter.append('feGaussianBlur').attr('stdDeviation', '4').attr('result', 'blur');
    filter.append('feMerge').selectAll('feMergeNode')
      .data(['blur', 'SourceGraphic'])
      .enter().append('feMergeNode').attr('in', d => d);

    // Background
    svg.append('rect')
      .attr('class', 'graph-bg')
      .attr('width', width)
      .attr('height', height);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Store dimensions for updates
    svg.node().__graphData = { g, innerWidth, innerHeight, margin };
    graphInitialized = true;

    updateGraph(timeline());
  }

  function updateGraph(tl) {
    if (!svgRef || !svgRef.__graphData) return;

    const { g, innerWidth, innerHeight } = d3.select(svgRef).node().__graphData;
    // Use memoized trajectory data and milestones for better performance
    const currentTrajectory = trajectoryData();
    const currentMilestones = milestones();

    // Auto-fit: compute dynamic X and Y domains from trajectory
    const xMin = 2024; // Start just before NOW
    const xMax = Math.ceil(tl.asiYear + 8); // End a bit after ASI

    const yValues = currentTrajectory.map(d => d.y);
    const yMin = 0; // Always start at 0
    const yMax = Math.min(1, Math.max(...yValues) + 0.1); // Add padding

    const xScale = d3.scaleLinear()
      .domain([xMin, xMax])
      .range([0, innerWidth]);

    const yScale = d3.scaleLinear()
      .domain([yMin, yMax])
      .range([innerHeight, 0]);

    // Clear everything except defs and background
    g.selectAll('*').remove();

    // Grid lines
    const gridGroup = g.append('g').attr('class', 'grid');

    // X grid (every 5 years)
    for (let year = Math.ceil(xMin / 5) * 5; year <= xMax; year += 5) {
      gridGroup.append('line')
        .attr('x1', xScale(year)).attr('y1', 0)
        .attr('x2', xScale(year)).attr('y2', innerHeight)
        .attr('stroke', 'rgba(255,255,255,0.04)')
        .attr('stroke-width', 1);
    }

    // Kardashev zones (only show zones within visible Y range)
    KARDASHEV_SCALE.forEach((zone, i) => {
      if (zone.yRange[0] > yMax) return; // Skip zones outside range

      const displayedY1 = Math.max(zone.yRange[0], yMin);
      const displayedY2 = Math.min(zone.yRange[1], yMax);

      if (displayedY1 >= displayedY2) return;

      const y1 = yScale(displayedY2);
      const y2 = yScale(displayedY1);
      const h = Math.max(0, y2 - y1);

      // Skip rendering if dimensions would be invalid
      if (h <= 0 || innerWidth <= 0) return;

      g.append('rect')
        .attr('x', 0)
        .attr('y', y1)
        .attr('width', Math.max(0, innerWidth))
        .attr('height', h)
        .attr('fill', zone.color)
        .attr('opacity', 0.08);

      if (zone.yRange[0] > yMin && zone.yRange[0] <= yMax) {
        g.append('line')
          .attr('x1', 0).attr('y1', yScale(zone.yRange[0]))
          .attr('x2', innerWidth).attr('y2', yScale(zone.yRange[0]))
          .attr('stroke', zone.color)
          .attr('stroke-width', 1)
          .attr('opacity', 0.2);
      }
    });

    // X-axis
    const xAxisGroup = g.append('g')
      .attr('transform', `translate(0,${innerHeight})`);

    for (let year = Math.ceil(xMin / 5) * 5; year <= xMax; year += 5) {
      xAxisGroup.append('text')
        .attr('x', xScale(year))
        .attr('y', 30)
        .attr('text-anchor', 'middle')
        .attr('fill', '#64748b')
        .attr('font-size', '11px')
        .attr('font-family', 'Space Grotesk')
        .text(year);
    }

    xAxisGroup.append('line')
      .attr('x1', 0).attr('y1', 0)
      .attr('x2', innerWidth).attr('y2', 0)
      .attr('stroke', 'rgba(255,255,255,0.1)')
      .attr('stroke-width', 1);

    // Y-axis Kardashev labels (INSIDE graph)
    KARDASHEV_SCALE.forEach(zone => {
      const midY = (zone.yRange[0] + zone.yRange[1]) / 2;
      const yPos = yScale(midY);

      // Only draw if visible
      if (yPos < 0 || yPos > innerHeight) return;

      g.append('text')
        .attr('x', 10) // Inside left edge
        .attr('y', yPos)
        .attr('text-anchor', 'start') // Align left
        .attr('fill', '#94a3b8') // Brighter for visibility
        .attr('font-size', '14px') // Slightly larger
        .attr('font-weight', '700')
        .attr('font-family', 'Space Grotesk')
        .style('text-shadow', '0 2px 4px rgba(0,0,0,0.8)') // Shadow for contrast against grid
        .text(zone.name);

      g.append('text')
        .attr('x', 10)
        .attr('y', yPos + 14)
        .attr('text-anchor', 'start')
        .attr('fill', '#64748b')
        .attr('font-size', '10px')
        .attr('font-family', 'Space Grotesk')
        .style('text-shadow', '0 2px 4px rgba(0,0,0,0.8)')
        .text(zone.subtitle);
    });

    // Axis title
    g.append('text')
      .attr('x', 10)
      .attr('y', 20)
      .attr('fill', '#64748b')
      .attr('font-size', '11px')
      .attr('font-weight', '600')
      .attr('font-family', 'Space Grotesk')
      .text('KARDASHEV SCALE');

    // Current marker (NOW)
    const nowX = xScale(2025.95);
    const nowY = yScale(0.12);

    g.append('circle')
      .attr('cx', nowX)
      .attr('cy', nowY)
      .attr('r', 8)
      .attr('fill', '#22c55e')
      .style('filter', 'url(#glow)');

    g.append('text')
      .attr('x', nowX)
      .attr('y', nowY - 20)
      .attr('text-anchor', 'middle')
      .attr('fill', '#22c55e')
      .attr('font-size', '14px')
      .attr('font-weight', '700')
      .attr('font-family', 'Space Grotesk')
      .text('NOW');

    // Draw trajectory
    const line = d3.line()
      .x(d => xScale(d.x))
      .y(d => yScale(d.y))
      .curve(d3.curveCatmullRom.alpha(0.5));

    const area = d3.area()
      .x(d => xScale(d.x))
      .y0(innerHeight)
      .y1(d => yScale(d.y))
      .curve(d3.curveCatmullRom.alpha(0.5));

    g.append('path')
      .attr('class', 'trajectory-area')
      .attr('d', area(currentTrajectory))
      .attr('fill', 'url(#trajGradient)')
      .attr('opacity', 0.08);

    g.append('path')
      .attr('class', 'trajectory-glow')
      .attr('d', line(currentTrajectory))
      .attr('fill', 'none')
      .attr('stroke', '#00f0ff')
      .attr('stroke-width', 12)
      .attr('opacity', 0.15)
      .style('filter', 'blur(6px)');

    g.append('path')
      .attr('class', 'trajectory-path')
      .attr('d', line(currentTrajectory))
      .attr('fill', 'none')
      .attr('stroke', 'url(#trajGradient)')
      .attr('stroke-width', 3)
      .attr('stroke-linecap', 'round');

    // Milestones (with Singularity) - positions calculated from trajectory curve
    const singularityYear = getSingularityYear(tl.asiYear);

    // Helper: find Y value on trajectory at a given year
    function getYAtYear(year) {
      // Find closest point in trajectory
      let closest = currentTrajectory[0];
      for (const pt of currentTrajectory) {
        if (Math.abs(pt.x - year) < Math.abs(closest.x - year)) {
          closest = pt;
        }
      }
      return closest.y;
    }

    // Add Singularity to milestones array
    const allMilestones = [...currentMilestones, { year: singularityYear, label: 'Singularity', color: '#ec4899' }];

    allMilestones.forEach((m, i) => {
      // Skip if outside visible range
      if (m.year < xMin || m.year > xMax) return;

      const mx = xScale(m.year);
      const curveY = getYAtYear(m.year); // Get Y from the curve!
      const my = yScale(curveY);

      const mg = g.append('g')
        .attr('class', 'milestone-group')
        .attr('transform', `translate(${mx},0)`);

      // Vertical line from dot to x-axis
      mg.append('line')
        .attr('x1', 0).attr('y1', my)
        .attr('x2', 0).attr('y2', innerHeight)
        .attr('stroke', m.color)
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '4,4')
        .attr('opacity', 0.5);

      // Dot ON the curve
      mg.append('circle')
        .attr('cy', my)
        .attr('r', 10)
        .attr('fill', m.color)
        .style('filter', 'url(#glow)');

      // Labels above the dot
      mg.append('text')
        .attr('x', 0)
        .attr('y', my - 45)
        .attr('text-anchor', 'middle')
        .attr('fill', m.color)
        .attr('font-size', '16px')
        .attr('font-weight', '600')
        .attr('font-family', 'Space Grotesk')
        .text(m.label);

      mg.append('text')
        .attr('x', 0)
        .attr('y', my - 25)
        .attr('text-anchor', 'middle')
        .attr('fill', m.color)
        .attr('font-size', '18px')
        .attr('font-weight', '700')
        .attr('font-family', 'Space Grotesk')
        .text(formatYear(m.year));
    });
  }

  // Initialize the horizontal timeline in the overlay
  function initTimelineChart() {
    if (!timelineSvgRef) return;

    const width = 2500; // Wide for scrolling
    const height = 280;
    const margin = { top: 40, right: 50, bottom: 60, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    d3.select(timelineSvgRef).selectAll('*').remove();

    const svg = d3.select(timelineSvgRef)
      .attr('width', width)
      .attr('height', height);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Scales
    const xScale = d3.scaleLinear()
      .domain([1950, 2025])
      .range([0, innerWidth]);

    const yScale = d3.scaleLinear()
      .domain([0, 1])
      .range([innerHeight, 0]);

    // Historical capability curve (slow exponential)
    const historicalData = [];
    for (let year = 1950; year <= 2025; year += 1) {
      const t = (year - 1950) / (2025 - 1950);
      const y = 0.02 + 0.10 * Math.pow(t, 0.4);
      historicalData.push({ x: year, y });
    }

    // Draw curve
    const line = d3.line()
      .x(d => xScale(d.x))
      .y(d => yScale(d.y))
      .curve(d3.curveMonotoneX);

    g.append('path')
      .attr('d', line(historicalData))
      .attr('fill', 'none')
      .attr('stroke', '#64748b')
      .attr('stroke-width', 2)
      .attr('opacity', 0.6);

    // Event dots on the curve
    const filteredEvents = historyFilter() === 'all'
      ? AI_HISTORY
      : AI_HISTORY.filter(e => e.category === historyFilter());

    filteredEvents.forEach(event => {
      const t = (event.year - 1950) / (2025 - 1950);
      const capY = 0.02 + 0.10 * Math.pow(t, 0.4);

      g.append('circle')
        .attr('cx', xScale(event.year))
        .attr('cy', yScale(capY))
        .attr('r', 6)
        .attr('fill', CATEGORY_COLORS[event.category])
        .attr('stroke', '#0a0a12')
        .attr('stroke-width', 2)
        .style('cursor', 'pointer')
        .on('mouseover', () => setHoveredEvent(event))
        .on('mouseout', () => setHoveredEvent(null));

      // Year label below
      g.append('text')
        .attr('x', xScale(event.year))
        .attr('y', innerHeight + 20)
        .attr('text-anchor', 'middle')
        .attr('fill', '#64748b')
        .attr('font-size', '9px')
        .attr('font-family', 'Space Grotesk')
        .text(event.year);
    });

    // X-axis line
    g.append('line')
      .attr('x1', 0).attr('y1', innerHeight)
      .attr('x2', innerWidth).attr('y2', innerHeight)
      .attr('stroke', 'rgba(255,255,255,0.2)')
      .attr('stroke-width', 1);

    // Decade labels
    for (let year = 1950; year <= 2020; year += 10) {
      g.append('text')
        .attr('x', xScale(year))
        .attr('y', innerHeight + 40)
        .attr('text-anchor', 'middle')
        .attr('fill', '#94a3b8')
        .attr('font-size', '12px')
        .attr('font-weight', '600')
        .attr('font-family', 'Space Grotesk')
        .text(year);
    }

    // "NOW" marker
    g.append('circle')
      .attr('cx', xScale(2025))
      .attr('cy', yScale(0.12))
      .attr('r', 10)
      .attr('fill', '#22c55e')
      .style('filter', 'drop-shadow(0 0 8px #22c55e)');

    g.append('text')
      .attr('x', xScale(2025))
      .attr('y', yScale(0.12) - 18)
      .attr('text-anchor', 'middle')
      .attr('fill', '#22c55e')
      .attr('font-size', '12px')
      .attr('font-weight', '700')
      .attr('font-family', 'Space Grotesk')
      .text('NOW');
  }

  // Re-render timeline when filter changes or overlay opens
  createEffect(() => {
    if (showHistory()) {
      setTimeout(() => initTimelineChart(), 50);
    }
  });

  createEffect(() => {
    historyFilter();
    if (showHistory() && timelineSvgRef) {
      initTimelineChart();
    }
  });

  // Throttled lever update to prevent excessive re-renders during slider drags
  const updateLever = throttle((id, value) => {
    setLevers(prev => ({ ...prev, [id]: parseFloat(value) }));
  }, 50);

  function resetLevers() {
    setLevers(LEVERS.reduce((acc, lever) => {
      acc[lever.id] = lever.default;
      return acc;
    }, {}));
    setSelectedScenario(null);
  }

  function getLeverValueClass(value) {
    if (value > 0) return 'positive';
    if (value < 0) return 'negative';
    return 'neutral';
  }

  function formatLeverValue(value) {
    return value > 0 ? `+${value}` : value.toString();
  }

  const leversByCategory = () => {
    const groups = {};
    LEVERS.forEach(lever => {
      if (!groups[lever.category]) groups[lever.category] = [];
      groups[lever.category].push(lever);
    });
    return groups;
  };

  function applyScenario(s) {
    if (selectedScenario() === s.id) {
      resetLevers();
    } else {
      setSelectedScenario(s.id);
      if (s.presets) setLevers({ ...s.presets });
    }
  }

  return (
    <div class="app-container">
      {/* Header */}
      <header class="header-overlay">
        <div class="logo-container">
          <div class="logo-title">Singularity <span style={{ color: 'var(--color-primary)' }}>Predictor</span></div>
          <div class="logo-subtitle">Interactive Timeline</div>
        </div>
        <div class="controls-container">
          <ShareButton timeline={timeline()} scenario={scenario()} />
          <a
            href="https://ko-fi.com/X8X81PXBH2"
            target="_blank"
            rel="noopener noreferrer"
            class="kofi-btn"
          >
            ☕ Support
          </a>
          <button
            class="about-btn"
            onClick={() => setShowLearn(!showLearn())}
          >
            Start Learning
          </button>
        </div>
      </header>

      {/* Predictions Bar - horizontal single line above graph */}
      <div class="predictions-bar">
        <span class="pred-label">Predicted Timeline:</span>
        <div class="pred-item">
          <span class="pred-name">AGI</span>
          <span class="pred-year agi">{Math.round(timeline().agiYear)}</span>
          <span class="pred-time">({getTimeRemaining(timeline().agiYear)})</span>
        </div>
        <div class="pred-item">
          <span class="pred-name">ASI/Superintelligence</span>
          <span class="pred-year asi">{Math.round(timeline().asiYear)}</span>
          <span class="pred-time">({getTimeRemaining(timeline().asiYear)})</span>
        </div>
        <div class="pred-item singularity">
          <span class="pred-name">Singularity</span>
          <span class="pred-year singularity-val">{Math.round(getSingularityYear(timeline().asiYear))}</span>
          <span class="pred-time">({getTimeRemaining(getSingularityYear(timeline().asiYear))})</span>
        </div>
      </div>

      {/* D3 Graph */}
      <div class="graph-fullscreen">
        <svg ref={svgRef}></svg>
      </div>

      {/* Lever Panel - Now Underneath Graph */}
      <div class="lever-panel">
        <div class="lever-categories-grid">
          <For each={Object.entries(leversByCategory())}>
            {([categoryId, categoryLevers]) => (
              <div class="lever-category">
                <div class="category-header" style={{ color: LEVER_CATEGORIES[categoryId].color }}>
                  <span class="category-icon">{LEVER_CATEGORIES[categoryId].icon}</span>
                  <span class="category-label">{LEVER_CATEGORIES[categoryId].label}</span>
                </div>
                <For each={categoryLevers}>
                  {(lever) => (
                    <div class="lever">
                      <div class="lever-header">
                        <span class="lever-label">{lever.label}</span>
                        <span class={`lever-value ${getLeverValueClass(levers()[lever.id])}`}>
                          {formatLeverValue(levers()[lever.id])}
                        </span>
                      </div>
                      <input
                        type="range"
                        class="lever-slider"
                        min={lever.min}
                        max={lever.max}
                        step="1"
                        value={levers()[lever.id]}
                        onInput={(e) => updateLever(lever.id, e.target.value)}
                      />
                    </div>
                  )}
                </For>
              </div>
            )}
          </For>
        </div>
        <button class="reset-btn" onClick={resetLevers}>↺ Reset</button>
      </div>

      {/* Scenarios Panel - Left Side */}
      <div class="scenarios-panel">
        <div class="scenario-title">Scenarios</div>
        <For each={Object.values(SCENARIOS)}>
          {(s) => (
            <div
              class={`scenario-card ${selectedScenario() === s.id ? 'active' : ''}`}
              onClick={() => applyScenario(s)}
            >
              <div class="scenario-header">
                <span class="scenario-icon">{s.icon}</span>
                <span class="scenario-name">{s.title}</span>
              </div>
              <Show when={selectedScenario() === s.id}>
                <div class="scenario-expanded">
                  <div class="scenario-desc">{s.description}</div>
                  <div class="scenario-conditions">{s.conditions}</div>
                </div>
              </Show>
            </div>
          )}
        </For>
      </div>





      {/* Learn Overlay */}
      <Show when={showLearn()}>
        <div class="learn-overlay">
          <div class="learn-header">
            <div class="history-title">
              <span class="icon">📚</span>
              <span>Understanding AI Futures</span>
            </div>
            <button class="close-btn" onClick={() => setShowLearn(false)}>×</button>
          </div>
          <div class="learn-tabs">
            <For each={INFO_TABS}>
              {(tab) => (
                <button class={`learn-tab ${activeTab() === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>
                  {tab.label}
                </button>
              )}
            </For>
          </div>
          <div class="learn-content">
            <For each={INFO_TABS}>
              {(tab) => (
                <Show when={activeTab() === tab.id}>
                  <div class="learn-card">
                    <h3>{tab.content.title}</h3>
                    <For each={tab.content.paragraphs}>{(p) => <p>{p}</p>}</For>

                    {/* Regular bullets for non-parameters tabs */}
                    <Show when={tab.content.bullets}>
                      <ul><For each={tab.content.bullets}>{(bullet) => <li>{bullet}</li>}</For></ul>
                    </Show>

                    {/* Custom rendering for parameters with categories */}
                    <Show when={tab.content.categories}>
                      <div class="params-grid">
                        <For each={tab.content.categories}>
                          {(cat) => (
                            <div class="param-category" style={{ 'border-color': cat.color }}>
                              <div class="param-category-header" style={{ color: cat.color }}>
                                <span class="param-icon">{cat.icon}</span>
                                <span class="param-cat-name">{cat.name}</span>
                              </div>
                              <div class="param-items">
                                <For each={cat.items}>
                                  {(item) => (
                                    <div class="param-item">
                                      <div class="param-name">{item.name}</div>
                                      <div class="param-desc">{item.desc}</div>
                                    </div>
                                  )}
                                </For>
                              </div>
                            </div>
                          )}
                        </For>
                      </div>
                    </Show>
                  </div>
                </Show>
              )}
            </For>
          </div>
        </div>
      </Show>
    </div>
  );
}

export default App;
