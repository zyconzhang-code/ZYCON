export interface OverlayUI {
  root: HTMLDivElement;
  pauseBtn: HTMLButtonElement;
  speedBtn: HTMLButtonElement;
  goldInfo: HTMLDivElement;
  lifeInfo: HTMLDivElement;
  waveInfo: HTMLDivElement;
  themeInfo: HTMLDivElement;
  mapInfo: HTMLDivElement;
  storeList: HTMLDivElement;
  selectedName: HTMLSpanElement;
  selectedElement: HTMLSpanElement;
  selectedRange: HTMLSpanElement;
  selectedRate: HTMLSpanElement;
  selectedDamage: HTMLSpanElement;
  upgradeLevel: HTMLSpanElement;
  upgradeCost: HTMLSpanElement;
  upgradeActions: HTMLDivElement;
  selectedActions: HTMLDivElement;
  bgmToggle: HTMLButtonElement;
  sfxToggle: HTMLButtonElement;
  waveQueue: HTMLDivElement;
  waveProgressBar: HTMLDivElement;
  eventBanner: HTMLDivElement;
}

export function createOverlay(): OverlayUI {
  const root = document.createElement('div');
  root.id = 'ui-root';
  root.innerHTML = `
    <div id="hud">
      <button id="pause-btn">暂停</button>
      <button id="speed-btn">速度: 1x</button>
      <div id="gold-info">资源: 0</div>
      <div id="life-info">生命: 0</div>
      <div id="wave-info">波次: 1</div>
      <div id="theme-info">场景: -</div>
      <div id="map-info">地图: -</div>
    </div>
    <div id="sidebar">
      <div class="section-title">商店</div>
      <div class="store-list" id="store-list"></div>
      <div class="section-title">波次队列</div>
      <div id="wave-queue" class="wave-queue"></div>
      <div id="wave-progress"><div id="wave-progress-bar"></div></div>
      <div class="section-title">已选宝可梦</div>
      <div class="panel">
        <div class="stat">名称 <span id="sel-name">-</span></div>
        <div class="stat">属性 <span id="sel-element">-</span></div>
        <div class="stat">范围 <span id="sel-range">-</span></div>
        <div class="stat">攻速 <span id="sel-rate">-</span></div>
        <div class="stat">伤害 <span id="sel-dmg">-</span></div>
        <div id="selected-actions" style="margin-top:8px; display:flex; gap:8px;"></div>
      </div>
      <div class="section-title">升级</div>
      <div class="panel">
        <div class="stat">等级 <span id="sel-level">-</span></div>
        <div class="stat">费用 <span id="upgrade-cost">-</span></div>
        <div id="upgrade-actions" style="margin-top:8px; display:flex; gap:8px;"></div>
      </div>
      <div class="section-title">设置</div>
      <div class="panel" style="display:flex; gap:8px;">
        <button id="bgm-toggle">BGM: 开</button>
        <button id="sfx-toggle">音效: 开</button>
      </div>
      <div id="event-banner"></div>
    </div>
  `;

  const app = document.getElementById('app');
  if (app) {
    app.appendChild(root);
  } else {
    document.body.appendChild(root);
  }

  return {
    root,
    pauseBtn: root.querySelector('#pause-btn') as HTMLButtonElement,
    speedBtn: root.querySelector('#speed-btn') as HTMLButtonElement,
    goldInfo: root.querySelector('#gold-info') as HTMLDivElement,
    lifeInfo: root.querySelector('#life-info') as HTMLDivElement,
    waveInfo: root.querySelector('#wave-info') as HTMLDivElement,
    themeInfo: root.querySelector('#theme-info') as HTMLDivElement,
    mapInfo: root.querySelector('#map-info') as HTMLDivElement,
    storeList: root.querySelector('#store-list') as HTMLDivElement,
    selectedName: root.querySelector('#sel-name') as HTMLSpanElement,
    selectedElement: root.querySelector('#sel-element') as HTMLSpanElement,
    selectedRange: root.querySelector('#sel-range') as HTMLSpanElement,
    selectedRate: root.querySelector('#sel-rate') as HTMLSpanElement,
    selectedDamage: root.querySelector('#sel-dmg') as HTMLSpanElement,
    upgradeLevel: root.querySelector('#sel-level') as HTMLSpanElement,
    upgradeCost: root.querySelector('#upgrade-cost') as HTMLSpanElement,
    upgradeActions: root.querySelector('#upgrade-actions') as HTMLDivElement,
    selectedActions: root.querySelector('#selected-actions') as HTMLDivElement,
    bgmToggle: root.querySelector('#bgm-toggle') as HTMLButtonElement,
    sfxToggle: root.querySelector('#sfx-toggle') as HTMLButtonElement,
    waveQueue: root.querySelector('#wave-queue') as HTMLDivElement,
    waveProgressBar: root.querySelector('#wave-progress-bar') as HTMLDivElement,
    eventBanner: root.querySelector('#event-banner') as HTMLDivElement
  };
}

export function destroyOverlay(ui: OverlayUI) {
  ui.root.remove();
}
