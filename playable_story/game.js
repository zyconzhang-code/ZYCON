(function () {
  const data = window.STORY_DATA;
  const nodeMap = new Map();
  data.nodes.forEach((n) => nodeMap.set(n.id, n));

  const ui = {
    nodeTitle: document.getElementById("node-title"),
    nodeTags: document.getElementById("node-tags"),
    storyText: document.getElementById("story-text"),
    choices: document.getElementById("choices"),
    continueWrap: document.getElementById("continue"),
    continueBtn: document.getElementById("btn-continue"),
    stateCore: document.getElementById("state-core"),
    stateAff: document.getElementById("state-aff"),
    log: document.getElementById("log"),
    battleUI: document.getElementById("battle-ui")
  };

  let state = deepClone(data.stateDefaults);
  if (!state._visited) state._visited = {};
  let currentNodeId = "CH1_01";
  let battleState = null;

  const companionDefs = {
    "沈照月": {
      name: "沈照月",
      hp: 90,
      atk: 20,
      def: 5,
      spd: 12,
      skill: { name: "月断", type: "attack", power: 1.6, qi: 20, apply: "BROKEN_ARMOR", chance: 0.5, turns: 2 }
    },
    "林雾音": {
      name: "林雾音",
      hp: 85,
      atk: 16,
      def: 5,
      spd: 11,
      skill: { name: "雾护", type: "support", qi: 20, heal: 18, sanity: 2 }
    },
    "唐越": {
      name: "唐越",
      hp: 95,
      atk: 17,
      def: 6,
      spd: 9,
      skill: { name: "越势", type: "attack", power: 1.3, qi: 20, apply: "ATK_UP", chance: 1, turns: 2 }
    },
    "顾星河": {
      name: "顾星河",
      hp: 100,
      atk: 18,
      def: 6,
      spd: 10,
      skill: { name: "破锋", type: "attack", power: 1.5, qi: 20, apply: "BROKEN_ARMOR", chance: 0.4, turns: 2 }
    },
    "木偶": {
      name: "木偶",
      hp: 70,
      atk: 12,
      def: 3,
      spd: 8,
      skill: { name: "刺击", type: "attack", power: 1.1, qi: 20 }
    },
    "路人": {
      name: "路人",
      hp: 75,
      atk: 11,
      def: 3,
      spd: 7,
      skill: { name: "护援", type: "support", qi: 20, heal: 10 }
    },
    "保安": {
      name: "保安",
      hp: 90,
      atk: 13,
      def: 5,
      spd: 7,
      skill: { name: "盾击", type: "attack", power: 1.2, qi: 20 }
    }
  };

  const enemyDefs = {
    E_WOOD_DUMMY: { name: "木偶靶", element: "wood" },
    E_FERAL_BOAR: { name: "荒林獠兽", element: "earth" },
    E_FERAL_SHAMAN: { name: "荒林咒徒", element: "shadow" },
    E_RUST_CLOWN: { name: "锈面小丑", element: "shadow" },
    E_RUST_JUGGLER: { name: "锈环杂耍者", element: "ice" },
    E_MIRROR_HOUND: { name: "倒影犬", element: "abyss" },
    E_SKINWALK_PROXY: { name: "借壳者", element: "abyss" },
    E_VOID_SOLDIER: { name: "虚渊兵", element: "abyss" },
    E_ABYSS_ACOLYTE: { name: "渊侍", element: "abyss" },
    B_MIRROR_RINGMASTER: { name: "倒映司仪", element: "abyss", boss: true },
    B_LUNAR_WARDEN: { name: "月环裁守", element: "abyss", boss: true },
    B_ZERO_PROXY: { name: "零号代理体", element: "abyss", boss: true }
  };

  function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function getVar(path) {
    const parts = path.split(".");
    let cur = state;
    for (const p of parts) {
      if (cur == null) return undefined;
      cur = cur[p];
    }
    return cur;
  }

  function setVar(path, value) {
    const parts = path.split(".");
    let cur = state;
    for (let i = 0; i < parts.length - 1; i++) {
      const key = parts[i];
      if (cur[key] == null) cur[key] = {};
      cur = cur[key];
    }
    cur[parts[parts.length - 1]] = value;
  }

  function addVar(path, delta) {
    const current = getVar(path);
    if (typeof current === "number") {
      setVar(path, current + delta);
    } else {
      setVar(path, delta);
    }
  }

  function applyEffects(effects) {
    if (!effects) return;
    effects.forEach((eff) => {
      if (eff.op === "set") setVar(eff.var, eff.value);
      if (eff.op === "add") addVar(eff.var, eff.value);
      if (eff.op === "flag") {
        if (!state.flag) state.flag = {};
        state.flag[eff.name] = true;
      }
    });
  }

  function log(message) {
    const line = document.createElement("div");
    line.textContent = message;
    ui.log.prepend(line);
  }

  function renderState() {
    const core = {
      day: state.day,
      chapter: state.chapter,
      cultivation: state.cultivation,
      sync: state.sync,
      sanity: state.sanity,
      credits: state.credits,
      fragment_count: state.fragment_count
    };
    ui.stateCore.innerHTML = "";
    Object.entries(core).forEach(([key, value]) => {
      ui.stateCore.appendChild(stateItem(key, value));
    });

    ui.stateAff.innerHTML = "";
    const affs = [
      ["照月", state.aff_moon],
      ["雾音", state.aff_mist],
      ["唐越", state.aff_tang]
    ];
    affs.forEach(([label, aff]) => {
      ui.stateAff.appendChild(stateItem(`${label}.bond`, aff.bond));
      ui.stateAff.appendChild(stateItem(`${label}.trust`, aff.trust));
      ui.stateAff.appendChild(stateItem(`${label}.rift`, aff.rift));
      ui.stateAff.appendChild(stateItem(`${label}.fate`, aff.fate));
    });
  }

  function stateItem(label, value) {
    const div = document.createElement("div");
    div.className = "state-item";
    const name = document.createElement("span");
    name.textContent = label;
    const val = document.createElement("span");
    val.textContent = value;
    div.appendChild(name);
    div.appendChild(val);
    return div;
  }

  function renderNode() {
    const node = nodeMap.get(currentNodeId) || missingNode(currentNodeId);
    ui.nodeTitle.textContent = node.title || node.id;
    ui.nodeTags.innerHTML = "";
    (node.tags || []).forEach((tag) => {
      const span = document.createElement("span");
      span.className = "tag";
      span.textContent = tag;
      ui.nodeTags.appendChild(span);
    });

    ui.storyText.innerHTML = "";
    renderText(node.text || []);

    ui.choices.innerHTML = "";
    ui.continueWrap.classList.add("hidden");
    ui.battleUI.classList.add("hidden");

    if (!state._visited[node.id]) {
      applyEffects(node.effects);
      state._visited[node.id] = true;
    }
    renderState();

    if (node.type === "battle") {
      startBattle(node);
      return;
    }

    if (node.choices && node.choices.length > 0) {
      node.choices.forEach((choice) => {
        const btn = document.createElement("button");
        btn.className = "choice-btn";
        btn.textContent = choice.text;
        btn.addEventListener("click", () => {
          applyEffects(choice.effects);
          goToNode(choice.goto);
        });
        ui.choices.appendChild(btn);
      });
    } else if (node.goto) {
      ui.continueWrap.classList.remove("hidden");
      ui.continueBtn.onclick = () => goToNode(node.goto);
    } else {
      if (node.tags && node.tags.includes("end_route")) {
        showEndingSummary();
      }
      ui.continueWrap.classList.remove("hidden");
      ui.continueBtn.onclick = () => goToNode("CH1_01");
    }
  }

  function renderText(lines) {
    lines.forEach((line) => {
      if (typeof line === "string") {
        const div = document.createElement("div");
        div.textContent = line;
        ui.storyText.appendChild(div);
      } else if (line && typeof line === "object") {
        const row = document.createElement("div");
        row.className = "line";
        const speaker = document.createElement("span");
        speaker.className = "speaker";
        speaker.textContent = `${line.speaker}：`;
        const text = document.createElement("span");
        text.textContent = line.line;
        row.appendChild(speaker);
        row.appendChild(text);
        ui.storyText.appendChild(row);
      }
    });
  }

  function missingNode(id) {
    return {
      id,
      title: "路线尚未实现",
      tags: ["placeholder"],
      text: ["你选择的路线暂未实现，请返回照月线。"],
      goto: "ROUTE_A_START"
    };
  }

  function goToNode(id) {
    currentNodeId = id;
    renderNode();
  }

  function startBattle(node) {
    battleState = createBattleState(node);
    ui.battleUI.classList.remove("hidden");
    renderBattle();
  }

  function createBattleState(node) {
    const party = resolveParty(node.party || []);
    const enemies = createEnemies(node.enemies || []);
    const rules = node.battle_rules || {};
    const stateObj = {
      node,
      party,
      enemies,
      turn: 1,
      phase: "player",
      activeIndex: 0,
      pendingAction: null,
      log: [],
      sanityDrain: rules.sanity_drain_per_turn || 0,
      triggers: (rules.special_triggers || []).slice(),
      appliedTriggers: new Set(),
      battleStatus: {
        erosionTurns: 0,
        hallucinationTurns: 0
      }
    };
    checkTriggers(stateObj);
    return stateObj;
  }

  function resolveParty(names) {
    const result = [];
    const used = new Set();

    const ranked = [
      { name: "沈照月", score: affinityScore(state.aff_moon) },
      { name: "林雾音", score: affinityScore(state.aff_mist) },
      { name: "唐越", score: affinityScore(state.aff_tang) }
    ].sort((a, b) => b.score - a.score);

    const pickRanked = () => {
      for (const item of ranked) {
        if (!used.has(item.name)) return item.name;
      }
      return "木偶";
    };

    const pickSecond = () => {
      for (let i = 1; i < ranked.length; i++) {
        if (!used.has(ranked[i].name)) return ranked[i].name;
      }
      return pickRanked();
    };

    names.forEach((raw) => {
      let name = raw;
      if (raw.includes("当前最高好感同伴")) name = pickRanked();
      else if (raw.includes("当前第二好感同伴")) name = pickSecond();
      else if (raw.includes("随机同伴")) name = pickRanked();
      else if (raw.includes("系统同伴")) name = "木偶";
      else if (raw.includes("路人")) name = "路人";
      else if (raw.includes("保安")) name = "保安";
      else if (raw.includes("临时：")) {
        const match = raw.match(/临时：([^）]+)\)/);
        name = match ? match[1] : raw;
      }
      name = name.replace(/[（）]/g, "").trim();
      if (!companionDefs[name]) {
        companionDefs[name] = {
          name,
          hp: 80,
          atk: 12,
          def: 4,
          spd: 8,
          skill: { name: "普通攻击", type: "attack", power: 1.0, qi: 20 }
        };
      }
      used.add(name);
      const unit = deepClone(companionDefs[name]);
      unit.maxHp = unit.hp;
      unit.qi = 0;
      unit.status = {};
      result.push(unit);
    });

    return result;
  }

  function affinityScore(aff) {
    return aff.bond + aff.trust - aff.rift + aff.fate * 0.2;
  }

  function createEnemies(list) {
    const enemies = [];
    list.forEach((entry) => {
      for (let i = 0; i < entry.count; i++) {
        enemies.push(createEnemy(entry.id, entry.level || 1));
      }
    });
    return enemies;
  }

  function createEnemy(id, level) {
    const def = enemyDefs[id] || { name: id, element: "unknown" };
    const boss = !!def.boss;
    const baseHp = boss ? 220 : 90;
    const baseAtk = boss ? 22 : 14;
    const hp = baseHp + level * (boss ? 18 : 12);
    const atk = baseAtk + level * (boss ? 4 : 3);
    const unit = {
      id,
      name: def.name,
      element: def.element,
      level,
      hp,
      maxHp: hp,
      atk,
      def: boss ? 6 : 3 + Math.floor(level / 5),
      spd: boss ? 9 : 8,
      status: {}
    };
    return unit;
  }

  function renderBattle() {
    if (!battleState) return;
    const { party, enemies } = battleState;
    ui.battleUI.innerHTML = "";

    const grid = document.createElement("div");
    grid.className = "battle-grid";

    const partyCol = document.createElement("div");
    const enemyCol = document.createElement("div");

    party.forEach((unit, idx) => {
      partyCol.appendChild(renderUnit(unit, false, idx));
    });

    enemies.forEach((unit, idx) => {
      enemyCol.appendChild(renderUnit(unit, true, idx));
    });

    grid.appendChild(partyCol);
    grid.appendChild(enemyCol);
    ui.battleUI.appendChild(grid);

    const actionWrap = document.createElement("div");
    actionWrap.className = "battle-actions";

    if (battleState.phase === "player") {
      const actor = nextAlivePlayer();
      if (actor) {
        const info = document.createElement("div");
        info.textContent = `轮到：${actor.name}（QI ${actor.qi}）`;
        info.style.marginRight = "12px";
        actionWrap.appendChild(info);

        const atkBtn = document.createElement("button");
        atkBtn.textContent = "攻击";
        atkBtn.onclick = () => {
          battleState.pendingAction = { type: "attack", actor };
          renderBattle();
        };
        actionWrap.appendChild(atkBtn);

        const skillBtn = document.createElement("button");
        skillBtn.textContent = actor.skill ? actor.skill.name : "技能";
        skillBtn.onclick = () => {
          if (!actor.skill) return;
          if (actor.qi < actor.skill.qi) {
            addBattleLog("气不足，无法施放技能。");
            return;
          }
          battleState.pendingAction = { type: "skill", actor };
          renderBattle();
        };
        actionWrap.appendChild(skillBtn);

        const guardBtn = document.createElement("button");
        guardBtn.textContent = "防御";
        guardBtn.onclick = () => {
          actor.status.GUARD = 1;
          addBattleLog(`${actor.name}进入防御。`);
          advancePlayerTurn();
        };
        actionWrap.appendChild(guardBtn);

        if (battleState.pendingAction) {
          const tip = document.createElement("div");
          tip.textContent = "选择目标";
          tip.style.color = "#ffcc66";
          actionWrap.appendChild(tip);
        }
      }
    }

    ui.battleUI.appendChild(actionWrap);

    const battleLog = document.createElement("div");
    battleLog.className = "battle-log";
    battleState.log.slice(-8).forEach((line) => {
      const div = document.createElement("div");
      div.textContent = line;
      battleLog.appendChild(div);
    });
    ui.battleUI.appendChild(battleLog);
  }

  function renderUnit(unit, isEnemy, idx) {
    const card = document.createElement("div");
    card.className = "unit";
    const name = document.createElement("div");
    name.className = "unit-name";
    name.textContent = `${unit.name} ${unit.hp <= 0 ? "(倒下)" : ""}`;

    const bar = document.createElement("div");
    bar.className = "hp-bar";
    const fill = document.createElement("span");
    const pct = unit.maxHp ? Math.max(0, unit.hp) / unit.maxHp : 0;
    fill.style.width = `${Math.floor(pct * 100)}%`;
    bar.appendChild(fill);

    const meta = document.createElement("div");
    meta.className = "unit-meta";
    const qiText = unit.qi != null ? `QI ${unit.qi}` : "";
    meta.textContent = `HP ${unit.hp}/${unit.maxHp} ${qiText}`.trim();

    card.appendChild(name);
    card.appendChild(bar);
    card.appendChild(meta);

    if (battleState && battleState.pendingAction && isEnemy && unit.hp > 0) {
      card.style.cursor = "pointer";
      card.style.borderColor = "rgba(255, 255, 255, 0.4)";
      card.onclick = () => resolveAction(idx);
    }

    return card;
  }

  function resolveAction(enemyIndex) {
    const action = battleState.pendingAction;
    if (!action) return;
    let enemy = battleState.enemies[enemyIndex];
    if (!enemy || enemy.hp <= 0) return;

    if (action.type === "attack") {
      if (battleState.battleStatus.hallucinationTurns > 0) {
        enemy = pickRandomAlive(battleState.enemies) || enemy;
      }
      performAttack(action.actor, enemy, 1.0);
    } else if (action.type === "skill") {
      if (battleState.battleStatus.hallucinationTurns > 0) {
        enemy = pickRandomAlive(battleState.enemies) || enemy;
      }
      performSkill(action.actor, enemy);
    }

    battleState.pendingAction = null;
    if (battleState.battleStatus.hallucinationTurns > 0) {
      battleState.battleStatus.hallucinationTurns -= 1;
    }
    advancePlayerTurn();
  }

  function performAttack(actor, target, power) {
    const atkMult = actor.status.ATK_UP ? 1.2 : 1.0;
    const defMult = target.status.BROKEN_ARMOR ? 0.7 : 1.0;
    const damage = Math.max(1, Math.floor(actor.atk * atkMult * power - target.def * defMult));
    target.hp -= damage;
    if (target.hp < 0) target.hp = 0;
    actor.qi = Math.min(100, actor.qi + 10);
    addBattleLog(`${actor.name}攻击${target.name}造成${damage}伤害。`);

    if (target.hp <= 0) {
      addBattleLog(`${target.name}被击败。`);
      actor.qi = Math.min(100, actor.qi + 12);
    }
  }

  function performSkill(actor, target) {
    const skill = actor.skill;
    if (!skill) return;
    actor.qi -= skill.qi || 0;
    if (skill.type === "support") {
      battleState.party.forEach((unit) => {
        if (unit.hp > 0) {
          unit.hp = Math.min(unit.maxHp, unit.hp + (skill.heal || 0));
        }
      });
      if (skill.sanity) state.sanity += skill.sanity;
      addBattleLog(`${actor.name}施放${skill.name}，队伍恢复。`);
      renderState();
      return;
    }
    performAttack(actor, target, skill.power || 1.2);
    if (skill.apply && Math.random() < (skill.chance || 1)) {
      target.status[skill.apply] = skill.turns || 1;
      addBattleLog(`${target.name}陷入${skill.apply}。`);
    }
  }

  function advancePlayerTurn() {
    decrementStatuses(battleState.party);
    if (isBattleOver()) return;

    battleState.activeIndex += 1;
    const next = nextAlivePlayer();
    if (!next) {
      battleState.phase = "enemy";
      enemyPhase();
      return;
    }
    renderBattle();
  }

  function nextAlivePlayer() {
    const party = battleState.party;
    for (let i = battleState.activeIndex; i < party.length; i++) {
      if (party[i].hp > 0) {
        battleState.activeIndex = i;
        return party[i];
      }
    }
    return null;
  }

  function enemyPhase() {
    battleState.enemies.forEach((enemy) => {
      if (enemy.hp <= 0) return;
      const target = pickRandomAlive(battleState.party);
      if (!target) return;
      const guardMult = target.status.GUARD ? 0.6 : 1.0;
      const damage = Math.max(1, Math.floor(enemy.atk * guardMult - target.def * 0.5));
      target.hp -= damage;
      if (target.hp < 0) target.hp = 0;
      target.qi = Math.min(100, target.qi + 6);
      addBattleLog(`${enemy.name}攻击${target.name}造成${damage}伤害。`);
    });

    battleState.phase = "player";
    battleState.activeIndex = 0;

    applyEndOfRound();

    if (isBattleOver()) return;
    renderBattle();
  }

  function applyEndOfRound() {
    battleState.turn += 1;
    if (battleState.sanityDrain) {
      state.sanity -= battleState.sanityDrain;
      addBattleLog(`理智下降 ${battleState.sanityDrain}。`);
    }
    if (battleState.battleStatus.erosionTurns > 0) {
      state.sanity -= 3;
      battleState.battleStatus.erosionTurns -= 1;
      addBattleLog("侵蚀加深，理智-3。");
    }
    renderState();
    checkTriggers(battleState);
  }

  function checkTriggers(bs) {
    bs.triggers.forEach((trigger, idx) => {
      if (bs.appliedTriggers.has(idx)) return;
      if (trigger.when === `turn==${bs.turn}`) {
        bs.appliedTriggers.add(idx);
        executeTrigger(trigger.action);
      }
    });
  }

  function executeTrigger(action) {
    if (!action) return;
    if (action.type === "apply_status") {
      if (action.status === "EROSION") {
        battleState.battleStatus.erosionTurns = Math.max(battleState.battleStatus.erosionTurns, action.duration || 2);
        addBattleLog("侵蚀降临，理智持续下降。");
      } else if (action.status === "HALLUCINATION") {
        battleState.battleStatus.hallucinationTurns = Math.max(battleState.battleStatus.hallucinationTurns, action.duration || 1);
        addBattleLog("幻象袭来，行动变得不稳。");
      } else if (action.status === "EERIE_WHISPER") {
        addBattleLog("诡语回响，心神不宁。");
      }
    }
    if (action.type === "dialogue_in_battle") {
      (action.text || []).forEach((line) => addBattleLog(`${line.speaker}：${line.line}`));
      applyEffects(action.effects);
      renderState();
    }
  }

  function decrementStatuses(units) {
    units.forEach((unit) => {
      Object.keys(unit.status).forEach((key) => {
        unit.status[key] -= 1;
        if (unit.status[key] <= 0) delete unit.status[key];
      });
    });
  }

  function pickRandomAlive(list) {
    const alive = list.filter((u) => u.hp > 0);
    if (!alive.length) return null;
    return alive[Math.floor(Math.random() * alive.length)];
  }

  function isBattleOver() {
    const enemiesAlive = battleState.enemies.some((e) => e.hp > 0);
    const partyAlive = battleState.party.some((p) => p.hp > 0);

    if (!enemiesAlive) {
      addBattleLog("战斗胜利。" );
      endBattle(true);
      return true;
    }
    if (!partyAlive || state.sanity <= 0) {
      addBattleLog("战斗失败。" );
      endBattle(false);
      return true;
    }
    return false;
  }

  function endBattle(win) {
    const next = win ? battleState.node.win_goto : battleState.node.lose_goto;
    battleState = null;
    renderState();
    ui.battleUI.classList.add("hidden");
    ui.continueWrap.classList.remove("hidden");
    ui.continueBtn.onclick = () => goToNode(next);
  }

  function addBattleLog(line) {
    battleState.log.push(line);
  }

  function showEndingSummary() {
    const summary = document.createElement("div");
    summary.style.marginTop = "16px";
    summary.style.padding = "12px";
    summary.style.border = "1px solid rgba(255,255,255,0.2)";
    summary.style.borderRadius = "10px";
    summary.style.background = "rgba(255,255,255,0.05)";

    const ending = computeEnding();
    summary.innerHTML = `<strong>结局判定：</strong> ${ending}`;
    ui.storyText.appendChild(summary);
  }

  function computeEnding() {
    if (state.sanity < 20) return "Bad End（倒映沉溺）";
    if (state.fragment_count >= 10 && state.sanity >= 65 && state.sync >= 75 && (state.oath === "SEAL" || state.oath === "DESCEND")) {
      return "True End（史诗誓约）";
    }
    if (state.fragment_count >= 8 && state.sanity >= 55 && state.cultivation >= 70) {
      return "Good End（封印）";
    }
    if (state.fragment_count >= 6 && state.sync < 70) {
      return "Normal End（勉强封住裂缝）";
    }
    return "未达成（可继续探索）";
  }

  document.getElementById("btn-save").addEventListener("click", () => {
    localStorage.setItem("eden_story_save", JSON.stringify({ state, currentNodeId }));
    log("已保存进度。" );
  });

  document.getElementById("btn-load").addEventListener("click", () => {
    const raw = localStorage.getItem("eden_story_save");
    if (!raw) {
      log("没有找到存档。" );
      return;
    }
    try {
      const parsed = JSON.parse(raw);
      state = parsed.state;
      if (!state._visited) state._visited = {};
      currentNodeId = parsed.currentNodeId;
      log("已读取进度。" );
      renderNode();
    } catch (err) {
      log("存档损坏。" );
    }
  });

  document.getElementById("btn-restart").addEventListener("click", () => {
    state = deepClone(data.stateDefaults);
    state._visited = {};
    currentNodeId = "CH1_01";
    battleState = null;
    log("已重开。" );
    renderNode();
  });

  renderNode();
})();
