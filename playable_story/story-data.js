window.STORY_DATA = {
  stateDefaults: {
    cultivation: 5,
    sync: 5,
    sanity: 85,
    credits: 120,
    fragment_count: 0,
    day: 1,
    chapter: 1,
    aff_moon: { bond: 10, trust: 15, rift: 5, fate: 20 },
    aff_mist: { bond: 25, trust: 25, rift: 0, fate: 15 },
    aff_tang: { bond: 8, trust: 10, rift: 12, fate: 18 },
    flag: {
      saw_black_tide: false,
      gave_fragment_to_lab: false,
      joined_permission_plan: false,
      used_forbidden_art: false,
      mist_mark_revealed: false,
      moon_key_candidate: false,
      admin_truth_known: false
    }
  },
  nodes: [
    // =========================
    // CH1: 雾湾停电夜
    // =========================
    {
      id: "CH1_01",
      type: "cutscene",
      title: "雾湾的风",
      tags: ["real_world", "intro", "moody"],
      bg: "bg_seaside_town_evening",
      music: "bgm_sea_wind_soft",
      text: [
        "雾湾的海风带着盐味，霓虹在潮湿的路面上拉出长长的倒影。",
        "你把耳机音量调小，仿佛怕某个声音会趁机钻进来。"
      ],
      effects: [
        { op: "set", var: "chapter", value: 1 }
      ]
    },
    {
      id: "CH1_02",
      type: "dialogue",
      title: "夜市：雾音的硬币",
      tags: ["romance", "subtle", "real_world"],
      bg: "bg_night_market_wet",
      music: "bgm_market_low",
      cast: [
        { name: "顾星河", pose: "neutral" },
        { name: "林雾音", pose: "gentle" }
      ],
      text: [
        { speaker: "林雾音", line: "你又熬夜。眼睛里像塞了雾。" },
        { speaker: "顾星河", line: "公测前一晚，谁睡得着。" },
        { speaker: "林雾音", line: "拿着。别问为什么。" },
        { speaker: "旁白", line: "她把一枚旧硬币放进你掌心——冷得不合常理。她的指尖在抖。" }
      ],
      choices: [
        {
          text: "握住她的手：'你冷吗？'",
          goto: "CH1_03",
          effects: [
            { op: "add", var: "aff_mist.bond", value: 6 },
            { op: "add", var: "aff_mist.trust", value: 2 }
          ]
        },
        {
          text: "开玩笑转移：'这算提前给我发奖励？'",
          goto: "CH1_03",
          effects: [
            { op: "add", var: "aff_mist.bond", value: 2 },
            { op: "add", var: "aff_mist.rift", value: 1 }
          ]
        }
      ]
    },
    {
      id: "CH1_03",
      type: "dialogue",
      title: "她的防御机制",
      tags: ["romance", "character_depth"],
      bg: "bg_night_market_wet",
      music: "bgm_market_low",
      cast: [
        { name: "林雾音", pose: "avoid" }
      ],
      text: [
        { speaker: "林雾音", line: "别看我。就当我今天矫情。" },
        { speaker: "顾星河", line: "你不矫情，你只是……像在害怕什么。" },
        { speaker: "林雾音", line: "害怕你明天醒来，发现我不在。" },
        { speaker: "旁白", line: "她说得很轻，像一句玩笑，尾音却裂开一丝颤。" }
      ],
      effects: [
        { op: "add", var: "aff_mist.trust", value: 2 }
      ],
      goto: "CH1_04"
    },
    {
      id: "CH1_04",
      type: "cutscene",
      title: "停电",
      tags: ["horror_hint", "real_world"],
      bg: "bg_street_neon_off",
      music: "bgm_sudden_silence",
      text: [
        "倒计时还没开始，全城先一步熄灯。",
        "霓虹像被掐断喉咙，街上的人群发出一阵迟来的惊呼。"
      ],
      effects: [
        { op: "add", var: "sanity", value: -2 }
      ],
      goto: "CH1_05"
    },
    {
      id: "CH1_05",
      type: "dialogue",
      title: "收音机低语",
      tags: ["horror", "mystery"],
      bg: "bg_apartment_dark",
      music: "bgm_radio_whisper",
      cast: [
        { name: "顾星河", pose: "tense" }
      ],
      text: [
        { speaker: "旁白", line: "你摸到桌上的旧收音机，它竟然在无电状态下亮了一下。" },
        { speaker: "收音机", line: "……回……来……门……要开了……" },
        { speaker: "顾星河", line: "谁？" }
      ],
      choices: [
        {
          text: "立刻去窗边看外面",
          goto: "CH1_06",
          effects: [
            { op: "add", var: "sanity", value: -1 }
          ]
        },
        {
          text: "给雾音发消息确认安全",
          goto: "CH1_06",
          effects: [
            { op: "add", var: "aff_mist.trust", value: 3 }
          ]
        }
      ]
    },
    {
      id: "CH1_06",
      type: "cutscene",
      title: "黑潮",
      tags: ["real_world", "epic_hint"],
      bg: "bg_sea_black_tide",
      music: "bgm_sea_dread",
      text: [
        "海面像被墨水覆盖，浪没有声音。",
        "你看见黑色的潮缓慢上涌，像在寻找某种入口。"
      ],
      choices: [
        {
          text: "拍照留证据",
          goto: "CH1_07",
          effects: [
            { op: "flag", name: "saw_black_tide" },
            { op: "add", var: "sanity", value: -2 }
          ]
        },
        {
          text: "不拍：直觉告诉你别留下痕迹",
          goto: "CH1_07",
          effects: [
            { op: "add", var: "sanity", value: 1 }
          ]
        }
      ]
    },
    {
      id: "CH1_07",
      type: "dialogue",
      title: "雾音的未接来电",
      tags: ["romance", "tension"],
      bg: "bg_apartment_dark",
      music: "bgm_phone_buzz",
      cast: [
        { name: "顾星河", pose: "worry" }
      ],
      text: [
        { speaker: "旁白", line: "你手机震动。屏幕亮起：林雾音。你刚要接——通话断了。" },
        { speaker: "旁白", line: "下一秒，一条短信弹出：'别来找我。别靠近海。'" }
      ],
      choices: [
        {
          text: "立刻冲出去找她",
          goto: "CH1_08",
          effects: [
            { op: "add", var: "aff_mist.bond", value: 4 },
            { op: "add", var: "sanity", value: -2 }
          ]
        },
        {
          text: "强迫自己冷静：先定位她手机",
          goto: "CH1_08",
          effects: [
            { op: "add", var: "aff_mist.trust", value: 2 },
            { op: "add", var: "sync", value: 1 }
          ]
        }
      ]
    },
    {
      id: "CH1_08",
      type: "cutscene",
      title: "倒映一瞬",
      tags: ["horror", "mirror_world_hint"],
      bg: "bg_alley_dark_reflection",
      music: "bgm_thin_whistle",
      text: [
        "你跑过一条小巷，积水里倒映出你的脸——但它对你笑了一下。",
        "你停住呼吸，那倒影的嘴唇无声地说：'进来。'"
      ],
      effects: [
        { op: "add", var: "sanity", value: -4 }
      ],
      goto: "CH1_09"
    },
    {
      id: "CH1_09",
      type: "dialogue",
      title: "她回来了",
      tags: ["romance", "subtle", "unease"],
      bg: "bg_night_market_wet",
      music: "bgm_market_aftershock",
      cast: [
        { name: "林雾音", pose: "pale_smile" }
      ],
      text: [
        { speaker: "林雾音", line: "我没事。真的。你看，我还会笑。" },
        { speaker: "顾星河", line: "你脸色像纸。" },
        { speaker: "林雾音", line: "纸也能挡风。你别追问，好吗？" },
        { speaker: "旁白", line: "她把你掌心里的硬币握紧，像怕它会烫。" }
      ],
      choices: [
        {
          text: "不追问：把外套披在她肩上",
          goto: "CH1_10",
          effects: [
            { op: "add", var: "aff_mist.bond", value: 6 },
            { op: "add", var: "aff_mist.rift", value: -1 }
          ]
        },
        {
          text: "逼问：'你到底去哪了？'",
          goto: "CH1_10",
          effects: [
            { op: "add", var: "aff_mist.trust", value: 1 },
            { op: "add", var: "aff_mist.rift", value: 6 }
          ]
        }
      ]
    },
    {
      id: "CH1_10",
      type: "cutscene",
      title: "倒计时归零",
      tags: ["epic", "transition"],
      bg: "bg_apartment_dark",
      music: "bgm_countdown",
      text: [
        "世界还在黑暗里，只有你的头盔指示灯亮着。",
        "倒计时归零。你听见一个声音在你脑后说：'欢迎回到轮回。'"
      ],
      effects: [
        { op: "set", var: "chapter", value: 2 },
        { op: "add", var: "sync", value: 3 }
      ],
      goto: "CH2_01"
    },

    // =========================
    // CH2: 公测开门
    // =========================
    {
      id: "CH2_01",
      type: "dialogue",
      title: "E.D.E.N.：灵根选择",
      tags: ["virtual_world", "setup"],
      bg: "bg_eden_creation_chamber",
      music: "bgm_eden_clean",
      cast: [
        { name: "系统提示", pose: "none" }
      ],
      text: [
        { speaker: "系统提示", line: "请选择你的灵根模板：剑/术/体/灵机。" },
        { speaker: "旁白", line: "每一个选择都像在决定你会成为什么样的人。" }
      ],
      choices: [
        {
          text: "剑（爆发/斩杀）",
          goto: "CH2_02",
          effects: [
            { op: "flag", name: "class_sword" },
            { op: "add", var: "cultivation", value: 3 }
          ]
        },
        {
          text: "术（控制/范围）",
          goto: "CH2_02",
          effects: [
            { op: "flag", name: "class_mage" },
            { op: "add", var: "cultivation", value: 2 },
            { op: "add", var: "sanity", value: 1 }
          ]
        },
        {
          text: "体（坦克/反击）",
          goto: "CH2_02",
          effects: [
            { op: "flag", name: "class_tank" },
            { op: "add", var: "cultivation", value: 2 }
          ]
        },
        {
          text: "灵机（召唤/远程）",
          goto: "CH2_02",
          effects: [
            { op: "flag", name: "class_mech" },
            { op: "add", var: "sync", value: 2 }
          ]
        }
      ]
    },
    {
      id: "CH2_02",
      type: "battle",
      title: "新手试炼：启灵",
      tags: ["battle", "tutorial"],
      bg: "bg_eden_trial_arena",
      music: "bgm_battle_tutorial",
      party: ["顾星河", "（系统同伴·木偶）", "（系统同伴·木偶）"],
      enemies: [
        { id: "E_WOOD_DUMMY", count: 3, level: 1 }
      ],
      win_goto: "CH2_03",
      lose_goto: "CH2_02",
      battle_rules: {
        sanity_drain_per_turn: 0,
        tutorial: true
      }
    },
    {
      id: "CH2_03",
      type: "cutscene",
      title: "现实掌纹发光",
      tags: ["real_world", "sync"],
      bg: "bg_apartment_dark",
      music: "bgm_heartbeat_low",
      text: [
        "你摘下头盔，掌心的纹路像被点亮。",
        "光很弱，却让你心脏发紧——这不该发生。"
      ],
      effects: [
        { op: "add", var: "sync", value: 5 },
        { op: "add", var: "sanity", value: -1 }
      ],
      goto: "CH2_04"
    },
    {
      id: "CH2_04",
      type: "dialogue",
      title: "初遇：沈照月的冷救场",
      tags: ["virtual_world", "romance", "high_density"],
      bg: "bg_eden_forest_path",
      music: "bgm_forest_tension",
      cast: [
        { name: "顾星河", pose: "hurt" },
        { name: "沈照月", pose: "cold_blade" }
      ],
      text: [
        { speaker: "旁白", line: "你被野怪围住，血条见底。手指发麻，连撤退都慢半拍。" },
        { speaker: "沈照月", line: "别乱按。你不是反应慢，你是心乱。" },
        { speaker: "顾星河", line: "你谁？" },
        { speaker: "沈照月", line: "路过。" },
        { speaker: "旁白", line: "她出剑很短，像切断一根绷紧的线。怪物的动作停了一瞬，然后碎成光。" },
        { speaker: "顾星河", line: "谢了。" },
        { speaker: "沈照月", line: "谢就别死。浪费时间。" },
        { speaker: "顾星河", line: "你说话一直这么……" },
        { speaker: "沈照月", line: "这么冷？是。因为热会让人犯错。" },
        { speaker: "旁白", line: "她转身要走，又停住，丢下一瓶药。没有回头。" },
        { speaker: "沈照月", line: "药别省。你的命没那么便宜。" }
      ],
      effects: [
        { op: "add", var: "aff_moon.bond", value: 4 },
        { op: "add", var: "aff_moon.trust", value: 3 }
      ],
      goto: "CH2_05"
    },
    {
      id: "CH2_05",
      type: "dialogue",
      title: "唐越登场：挑衅与关注",
      tags: ["virtual_world", "rival_romance"],
      bg: "bg_eden_town_square",
      music: "bgm_town_neon",
      cast: [
        { name: "唐越", pose: "smirk" }
      ],
      text: [
        { speaker: "唐越", line: "新号？刚才那波差点把自己送走，挺有意思。" },
        { speaker: "顾星河", line: "你一直在看？" },
        { speaker: "唐越", line: "我只看有潜力的人。你——勉强算。" }
      ],
      choices: [
        {
          text: "回怼：'那你来教我？'",
          goto: "CH2_06",
          effects: [
            { op: "add", var: "aff_tang.bond", value: 3 },
            { op: "add", var: "aff_tang.rift", value: 2 }
          ]
        },
        {
          text: "冷处理：'没空陪你玩。'",
          goto: "CH2_06",
          effects: [
            { op: "add", var: "aff_tang.trust", value: -1 },
            { op: "add", var: "aff_tang.rift", value: 1 }
          ]
        }
      ]
    },
    {
      id: "CH2_06",
      type: "schedule",
      title: "日程解锁：训练/调查/社交",
      tags: ["growth", "system_unlock"],
      bg: "bg_calendar_ui",
      music: "bgm_ui_soft",
      text: [
        "你获得第一天自由日程：训练提升修为，调查提升线索，社交提升关系。"
      ],
      effects: [
        { op: "add", var: "day", value: 1 }
      ],
      goto: "CH2_07"
    },
    {
      id: "CH2_07",
      type: "dialogue",
      title: "雾音的信息：别靠近海",
      tags: ["real_world", "romance", "unease"],
      bg: "bg_phone_screen",
      music: "bgm_phone_sad",
      cast: [
        { name: "林雾音", pose: "none" }
      ],
      text: [
        { speaker: "短信", line: "别靠近海。也别问我为什么。今晚别上线太久。" },
        { speaker: "顾星河", line: "你到底怎么了？" }
      ],
      choices: [
        {
          text: "答应她：今晚早点下线",
          goto: "CH2_08",
          effects: [
            { op: "add", var: "aff_mist.trust", value: 4 },
            { op: "add", var: "aff_mist.bond", value: 2 }
          ]
        },
        {
          text: "隐瞒：嘴上答应，心里决定继续查",
          goto: "CH2_08",
          effects: [
            { op: "add", var: "aff_mist.bond", value: 2 },
            { op: "add", var: "aff_mist.rift", value: 3 },
            { op: "add", var: "sync", value: 2 }
          ]
        }
      ]
    },
    {
      id: "CH2_08",
      type: "cutscene",
      title: "系统公告：第一场竞技",
      tags: ["virtual_world", "epic"],
      bg: "bg_eden_arena_poster",
      music: "bgm_announcement",
      text: [
        "系统公告：明晚开启全服竞技序列——胜者将获得'权限徽记'。"
      ],
      goto: "CH2_09"
    },
    {
      id: "CH2_09",
      type: "battle",
      title: "小队战：林地伏击",
      tags: ["battle"],
      bg: "bg_eden_forest_path",
      music: "bgm_battle_mid",
      party: ["顾星河", "（随机同伴）", "（随机同伴）"],
      enemies: [
        { id: "E_FERAL_BOAR", count: 2, level: 3 },
        { id: "E_FERAL_SHAMAN", count: 1, level: 4 }
      ],
      win_goto: "CH2_10",
      lose_goto: "CH2_09",
      battle_rules: {
        sanity_drain_per_turn: 0
      }
    },
    {
      id: "CH2_10",
      type: "cutscene",
      title: "启灵完成：命轮一闪",
      tags: ["sync", "mystery"],
      bg: "bg_eden_forest_clearing",
      music: "bgm_mystery_soft",
      text: [
        "你突破时，视野里闪过一扇门的轮廓。",
        "门后有人低声说：'十二把锁，只差最后一把。'"
      ],
      effects: [
        { op: "add", var: "cultivation", value: 4 },
        { op: "add", var: "sanity", value: -2 },
        { op: "set", var: "chapter", value: 3 }
      ],
      goto: "CH3_01"
    },

    // =========================
    // CH3: 同步蔓延
    // =========================
    {
      id: "CH3_01",
      type: "cutscene",
      title: "梦游失踪",
      tags: ["real_world", "horror"],
      bg: "bg_school_board_missing",
      music: "bgm_cold_notice",
      text: [
        "公告栏贴着寻人启事：昨夜又有人梦游走向海边。",
        "你盯着照片，忽然觉得对方的眼神像在看着你。"
      ],
      effects: [
        { op: "add", var: "sanity", value: -2 }
      ],
      goto: "CH3_02"
    },
    {
      id: "CH3_02",
      type: "dialogue",
      title: "雾音的崩溃与强撑",
      tags: ["romance", "high_density", "real_world"],
      bg: "bg_school_stairs_rain",
      music: "bgm_rain_close",
      cast: [
        { name: "林雾音", pose: "tremble_smile" },
        { name: "顾星河", pose: "worry" }
      ],
      text: [
        { speaker: "旁白", line: "楼梯间潮湿，她把伞收得很慢，像在给自己争取一秒钟呼吸。" },
        { speaker: "顾星河", line: "你昨晚说别上线太久——你知道会发生什么？" },
        { speaker: "林雾音", line: "我不知道。我只是……听见它在学人说话。" },
        { speaker: "顾星河", line: "它？" },
        { speaker: "林雾音", line: "你别用那个眼神看我。我没疯。" },
        { speaker: "旁白", line: "她笑了一下，笑意像薄玻璃，下一秒就碎。" },
        { speaker: "林雾音", line: "它叫我。像小时候叫我那样。可我不记得小时候发生过什么。" },
        { speaker: "顾星河", line: "你在害怕什么？" },
        { speaker: "林雾音", line: "害怕我有一天回头，发现我抱着的不是你——只是你的倒影。" },
        { speaker: "旁白", line: "她终于低下头，声音被雨吞掉一半：" },
        { speaker: "林雾音", line: "星河……如果我变得不对劲，你能不能先别讨厌我？" }
      ],
      choices: [
        {
          text: "抱住她：'你先别丢下我。'",
          goto: "CH3_03",
          effects: [
            { op: "add", var: "aff_mist.bond", value: 10 },
            { op: "add", var: "aff_mist.trust", value: 6 },
            { op: "add", var: "aff_mist.fate", value: 2 }
          ]
        },
        {
          text: "克制：握住她手腕脉搏，转移到'我们一起查清楚'",
          goto: "CH3_03",
          effects: [
            { op: "add", var: "aff_mist.trust", value: 8 },
            { op: "add", var: "aff_mist.bond", value: 4 },
            { op: "add", var: "aff_mist.rift", value: 1 }
          ]
        }
      ]
    },
    {
      id: "CH3_03",
      type: "schedule",
      title: "日程：调查开启（线索值）",
      tags: ["system_unlock", "investigation"],
      bg: "bg_calendar_ui",
      music: "bgm_ui_soft",
      text: [
        "你解锁调查行动：可在校园/海边/旧游乐园/实验站外围收集线索。"
      ],
      goto: "CH3_04"
    },
    {
      id: "CH3_04",
      type: "dialogue",
      title: "照月的警告：别信系统",
      tags: ["virtual_world", "character_depth"],
      bg: "bg_eden_town_square",
      music: "bgm_town_neon",
      cast: [
        { name: "沈照月", pose: "cold_focus" }
      ],
      text: [
        { speaker: "沈照月", line: "你最近的突破太顺了。顺得像有人给你铺路。" },
        { speaker: "顾星河", line: "你想说系统在选人？" },
        { speaker: "沈照月", line: "我想说——别把命交给看不见的手。" }
      ],
      effects: [
        { op: "add", var: "aff_moon.trust", value: 3 },
        { op: "add", var: "aff_moon.fate", value: 2 }
      ],
      goto: "CH3_05"
    },
    {
      id: "CH3_05",
      type: "dialogue",
      title: "唐越的挑衅：竞技见",
      tags: ["virtual_world", "rival_romance"],
      bg: "bg_eden_arena_gate",
      music: "bgm_arena_hype",
      cast: [
        { name: "唐越", pose: "grin" }
      ],
      text: [
        { speaker: "唐越", line: "明晚竞技，我要你在全服面前输一次。" },
        { speaker: "顾星河", line: "你这么确定？" },
        { speaker: "唐越", line: "我确定你会变强。强到让我不得不认真。" }
      ],
      choices: [
        {
          text: "接战：'那就来。'",
          goto: "CH3_06",
          effects: [
            { op: "add", var: "aff_tang.bond", value: 2 },
            { op: "add", var: "aff_tang.fate", value: 2 }
          ]
        },
        {
          text: "无视：'我还有更重要的事。'",
          goto: "CH3_06",
          effects: [
            { op: "add", var: "aff_tang.rift", value: 3 }
          ]
        }
      ]
    },
    {
      id: "CH3_06",
      type: "battle",
      title: "现实裂隙前兆：倒影犬",
      tags: ["battle", "real_world", "horror"],
      bg: "bg_alley_dark_reflection",
      music: "bgm_battle_horror",
      party: ["顾星河", "（临时：林雾音）", "（路人协助）"],
      enemies: [
        { id: "E_MIRROR_HOUND", count: 2, level: 6 },
        { id: "E_MIRROR_HOUND", count: 1, level: 7 }
      ],
      win_goto: "CH3_07",
      lose_goto: "CH3_06",
      battle_rules: {
        sanity_drain_per_turn: 1,
        special_triggers: [
          {
            when: "turn==2",
            action: {
              type: "apply_status",
              target: "party_all",
              status: "EERIE_WHISPER",
              duration: 2
            }
          }
        ]
      }
    },
    {
      id: "CH3_07",
      type: "dialogue",
      title: "战后：雾音的手在抖",
      tags: ["romance", "subtle", "aftermath"],
      bg: "bg_alley_dark_reflection",
      music: "bgm_after_battle_low",
      cast: [
        { name: "林雾音", pose: "shock" }
      ],
      text: [
        { speaker: "旁白", line: "她把手藏进袖子里，可你仍看见她指节发白。" },
        { speaker: "林雾音", line: "我没事……你别看我。" },
        { speaker: "顾星河", line: "你刚才差点被拖进水里。" },
        { speaker: "林雾音", line: "我怕的不是死。我怕醒来以后——我会想回去。" }
      ],
      effects: [
        { op: "add", var: "aff_mist.fate", value: 3 },
        { op: "add", var: "sanity", value: -2 }
      ],
      goto: "CH3_08"
    },
    {
      id: "CH3_08",
      type: "cutscene",
      title: "镜界第一次'借壳'",
      tags: ["horror", "mystery"],
      bg: "bg_street_cctv_glitch",
      music: "bgm_glitch",
      text: [
        "监控画面里，一个失踪者从海边走回来了。",
        "他对着镜头笑，嘴唇无声地动：'门要开了。'"
      ],
      effects: [
        { op: "add", var: "sanity", value: -3 }
      ],
      goto: "CH3_09"
    },
    {
      id: "CH3_09",
      type: "schedule",
      title: "日程：训练/调查/社交（第2天）",
      tags: ["growth"],
      bg: "bg_calendar_ui",
      music: "bgm_ui_soft",
      text: [
        "你获得第2天日程。建议：调查游乐园线索或备战竞技。"
      ],
      effects: [
        { op: "add", var: "day", value: 1 }
      ],
      goto: "CH3_10"
    },
    {
      id: "CH3_10",
      type: "cutscene",
      title: "竞技序列开启",
      tags: ["virtual_world", "epic"],
      bg: "bg_eden_arena_crowd",
      music: "bgm_arena_hype",
      text: [
        "全服广播响起，竞技序列像一把刀切开夜晚。",
        "你忽然意识到：这场比赛，可能不只是游戏。"
      ],
      effects: [
        { op: "set", var: "chapter", value: 4 }
      ],
      goto: "CH4_01"
    },

    // =========================
    // CH4: 游乐园遗迹
    // =========================
    {
      id: "CH4_01",
      type: "dialogue",
      title: "三人同队：短暂的平衡",
      tags: ["team", "tension"],
      bg: "bg_eden_party_room",
      music: "bgm_room_low",
      cast: [
        { name: "沈照月", pose: "cold_focus" },
        { name: "林雾音", pose: "gentle_guard" },
        { name: "唐越", pose: "smirk" }
      ],
      text: [
        { speaker: "唐越", line: "哟，居然能凑一队。你们两个别拖后腿。" },
        { speaker: "沈照月", line: "你嘴太吵。" },
        { speaker: "林雾音", line: "我们先把副本过了，好吗？" }
      ],
      choices: [
        {
          text: "站照月：让唐越闭嘴",
          goto: "CH4_02",
          effects: [
            { op: "add", var: "aff_moon.bond", value: 3 },
            { op: "add", var: "aff_tang.rift", value: 3 }
          ]
        },
        {
          text: "站雾音：缓和气氛",
          goto: "CH4_02",
          effects: [
            { op: "add", var: "aff_mist.trust", value: 2 },
            { op: "add", var: "aff_mist.bond", value: 2 }
          ]
        },
        {
          text: "站唐越：用玩笑压住尴尬",
          goto: "CH4_02",
          effects: [
            { op: "add", var: "aff_tang.bond", value: 3 },
            { op: "add", var: "aff_moon.rift", value: 1 }
          ]
        }
      ]
    },
    {
      id: "CH4_02",
      type: "battle",
      title: "游乐园遗迹：入口守卫",
      tags: ["battle", "epic"],
      bg: "bg_amusement_park_ruins",
      music: "bgm_battle_mid",
      party: ["顾星河", "沈照月", "唐越"],
      enemies: [
        { id: "E_RUST_CLOWN", count: 2, level: 9 },
        { id: "E_RUST_JUGGLER", count: 1, level: 10 }
      ],
      win_goto: "CH4_03",
      lose_goto: "CH4_02",
      battle_rules: {
        sanity_drain_per_turn: 1
      }
    },
    {
      id: "CH4_03",
      type: "dialogue",
      title: "雾音看见了不该存在的东西",
      tags: ["horror", "romance"],
      bg: "bg_amusement_park_ruins",
      music: "bgm_mystery_soft",
      cast: [
        { name: "林雾音", pose: "pale" }
      ],
      text: [
        { speaker: "林雾音", line: "这里……我来过。" },
        { speaker: "顾星河", line: "你不是第一次进这个副本？" },
        { speaker: "林雾音", line: "不是副本。是现实。小时候。" }
      ],
      effects: [
        { op: "add", var: "aff_mist.fate", value: 4 },
        { op: "add", var: "sanity", value: -2 }
      ],
      goto: "CH4_04"
    },
    {
      id: "CH4_04",
      type: "cutscene",
      title: "星封碎片·其一",
      tags: ["artifact", "epic"],
      bg: "bg_ruins_core_chamber",
      music: "bgm_relic",
      text: [
        "你触碰到碎片的一瞬，听见远古战场的回声：",
        "‘守封者以命轮为锁——门不可开。’"
      ],
      effects: [
        { op: "add", var: "fragment_count", value: 1 },
        { op: "add", var: "cultivation", value: 4 }
      ],
      goto: "CH4_05"
    },
    {
      id: "CH4_05",
      type: "dialogue",
      title: "照月短暂失控",
      tags: ["character_depth", "romance"],
      bg: "bg_ruins_core_chamber",
      music: "bgm_thin_dread",
      cast: [
        { name: "沈照月", pose: "glitch" }
      ],
      text: [
        { speaker: "沈照月", line: "……别叫我那个名字。" },
        { speaker: "顾星河", line: "哪个名字？" },
        { speaker: "沈照月", line: "我不知道。但它在我骨头里回响。" }
      ],
      choices: [
        {
          text: "靠近：'你看着我。现在的你就是你。'",
          goto: "CH4_06",
          effects: [
            { op: "add", var: "aff_moon.trust", value: 6 },
            { op: "add", var: "aff_moon.bond", value: 4 },
            { op: "add", var: "aff_moon.fate", value: 2 }
          ]
        },
        {
          text: "后退：保持距离，先结束副本",
          goto: "CH4_06",
          effects: [
            { op: "add", var: "aff_moon.rift", value: 3 },
            { op: "add", var: "aff_moon.trust", value: 1 }
          ]
        }
      ]
    },
    {
      id: "CH4_06",
      type: "battle",
      title: "遗迹 Boss：倒映司仪",
      tags: ["battle", "boss", "epic"],
      bg: "bg_ruins_core_chamber",
      music: "bgm_boss_circus_dread",
      party: ["顾星河", "沈照月", "林雾音"],
      enemies: [
        { id: "B_MIRROR_RINGMASTER", count: 1, level: 12 },
        { id: "E_RUST_CLOWN", count: 2, level: 11 }
      ],
      win_goto: "CH4_07",
      lose_goto: "CH4_06",
      battle_rules: {
        sanity_drain_per_turn: 2,
        special_triggers: [
          {
            when: "turn==3",
            action: {
              type: "apply_status",
              target: "party_random",
              status: "HALLUCINATION",
              duration: 1
            }
          }
        ]
      }
    },
    {
      id: "CH4_07",
      type: "cutscene",
      title: "现实同步：同夜命案",
      tags: ["real_world", "shock"],
      bg: "bg_news_police_tape",
      music: "bgm_news_cold",
      text: [
        "你下线时，手机推送弹出：旧游乐园发现尸体。",
        "照片里那扇破门，和副本里一模一样。"
      ],
      effects: [
        { op: "add", var: "sanity", value: -4 }
      ],
      goto: "CH4_08"
    },
    {
      id: "CH4_08",
      type: "dialogue",
      title: "三人裂缝：价值观冲突",
      tags: ["tension", "choice_prep"],
      bg: "bg_group_chat_glow",
      music: "bgm_tension_low",
      cast: [
        { name: "唐越", pose: "serious" },
        { name: "沈照月", pose: "cold" },
        { name: "林雾音", pose: "hurt" }
      ],
      text: [
        { speaker: "唐越", line: "现在你们还觉得只是游戏？" },
        { speaker: "沈照月", line: "越早弄清系统目的，越能活。" },
        { speaker: "林雾音", line: "可现实有人死了。我们先救人。" }
      ],
      goto: "CH4_09"
    },
    {
      id: "CH4_09",
      type: "schedule",
      title: "日程（第3天）：备战/调查游乐园",
      tags: ["growth", "investigation"],
      bg: "bg_calendar_ui",
      music: "bgm_ui_soft",
      text: [
        "你获得第3天日程。若去调查现实游乐园，sanity 风险更高，但线索更多。"
      ],
      effects: [
        { op: "add", var: "day", value: 1 }
      ],
      goto: "CH4_10"
    },
    {
      id: "CH4_10",
      type: "cutscene",
      title: "星封低语：十二把锁",
      tags: ["epic", "mystery"],
      bg: "bg_sleep_hallway_reflection",
      music: "bgm_whisper",
      text: [
        "你入睡时听见低语：‘十二把锁，只差最后一把。’",
        "掌心硬币在黑暗里发出轻响，像有人在敲门。"
      ],
      effects: [
        { op: "set", var: "chapter", value: 5 }
      ],
      goto: "CH5_01"
    },

    // =========================
    // CH5: 地下实验站
    // =========================
    {
      id: "CH5_01",
      type: "cutscene",
      title: "实验站外围",
      tags: ["real_world", "investigation"],
      bg: "bg_lab_outside_fog",
      music: "bgm_cold_air",
      text: [
        "实验站外墙有新刷的漆，遮不住旧裂缝。",
        "你闻到一股消毒水味，像想洗掉什么。"
      ],
      goto: "CH5_02"
    },
    {
      id: "CH5_02",
      type: "dialogue",
      title: "父亲日志：天门与守封者",
      tags: ["lore", "epic"],
      bg: "bg_lab_archive_room",
      music: "bgm_archive",
      cast: [
        { name: "旁白", pose: "none" }
      ],
      text: [
        { speaker: "旁白", line: "你翻到一段被撕碎的研究日志：" },
        { speaker: "旁白", line: "‘天门并非神话，是一次又一次重启的开关。守封者用命轮当锁。’" },
        { speaker: "旁白", line: "‘E.D.E.N. 不是游戏，是筛选器。’" }
      ],
      effects: [
        { op: "add", var: "sync", value: 4 },
        { op: "add", var: "sanity", value: -1 }
      ],
      goto: "CH5_03"
    },
    {
      id: "CH5_03",
      type: "dialogue",
      title: "雾音 vs 照月：第一次正面冲突",
      tags: ["high_density", "tension", "romance"],
      bg: "bg_lab_hallway_cold",
      music: "bgm_argument_soft",
      cast: [
        { name: "沈照月", pose: "cold" },
        { name: "林雾音", pose: "hurt_brave" },
        { name: "顾星河", pose: "torn" }
      ],
      text: [
        { speaker: "沈照月", line: "你想救人？救得过系统吗。" },
        { speaker: "林雾音", line: "至少我不拿‘弄清楚’当借口，去忽略正在死的人。" },
        { speaker: "沈照月", line: "死很常见。被操控才可怕。" },
        { speaker: "林雾音", line: "你说得像你从没害怕过。" },
        { speaker: "沈照月", line: "我当然害怕。所以我更不能软。" },
        { speaker: "旁白", line: "她的声音很稳，指节却绷得发白。那不是冷，是把恐惧塞回骨头里的力气。" },
        { speaker: "林雾音", line: "星河，你要站哪边？" },
        { speaker: "沈照月", line: "别让她把你绑在情绪上。" },
        { speaker: "旁白", line: "两双眼睛都在等你——一双求你留下温度，一双求你别犯错。" }
      ],
      choices: [
        {
          text: "偏向雾音：'先救现实的人。'",
          goto: "CH5_04",
          effects: [
            { op: "add", var: "aff_mist.trust", value: 6 },
            { op: "add", var: "aff_mist.bond", value: 4 },
            { op: "add", var: "aff_moon.rift", value: 5 }
          ]
        },
        {
          text: "偏向照月：'先搞清系统。'",
          goto: "CH5_04",
          effects: [
            { op: "add", var: "aff_moon.trust", value: 6 },
            { op: "add", var: "aff_moon.bond", value: 2 },
            { op: "add", var: "aff_mist.rift", value: 5 }
          ]
        },
        {
          text: "折中：'我两边都要。我们分工。'",
          goto: "CH5_04",
          effects: [
            { op: "add", var: "aff_mist.trust", value: 3 },
            { op: "add", var: "aff_moon.trust", value: 3 },
            { op: "add", var: "aff_mist.rift", value: 2 },
            { op: "add", var: "aff_moon.rift", value: 2 }
          ]
        }
      ]
    },
    {
      id: "CH5_04",
      type: "dialogue",
      title: "唐越的条件：权限计划",
      tags: ["rival_romance", "deal"],
      bg: "bg_eden_private_lounge",
      music: "bgm_private_low",
      cast: [
        { name: "唐越", pose: "serious_smile" }
      ],
      text: [
        { speaker: "唐越", line: "你要真相？我有。你要救人？我也有办法。" },
        { speaker: "唐越", line: "加入权限计划。你会看到系统的后台——也会被它看到。" }
      ],
      choices: [
        {
          text: "答应：加入权限计划",
          goto: "CH5_05",
          effects: [
            { op: "flag", name: "joined_permission_plan" },
            { op: "add", var: "aff_tang.trust", value: 6 },
            { op: "add", var: "aff_tang.fate", value: 4 },
            { op: "add", var: "sync", value: 6 }
          ]
        },
        {
          text: "拒绝：不把命押给财团",
          goto: "CH5_05",
          effects: [
            { op: "add", var: "aff_tang.rift", value: 4 },
            { op: "add", var: "aff_tang.bond", value: 1 },
            { op: "add", var: "sanity", value: 1 }
          ]
        }
      ]
    },
    {
      id: "CH5_05",
      type: "battle",
      title: "实验站外：借壳者",
      tags: ["battle", "real_world", "horror"],
      bg: "bg_lab_outside_fog",
      music: "bgm_battle_horror",
      party: ["顾星河", "（当前最高好感同伴）", "（临时：保安）"],
      enemies: [
        { id: "E_SKINWALK_PROXY", count: 2, level: 13 },
        { id: "E_MIRROR_HOUND", count: 1, level: 12 }
      ],
      win_goto: "CH5_06",
      lose_goto: "CH5_05",
      battle_rules: {
        sanity_drain_per_turn: 2
      }
    },
    {
      id: "CH5_06",
      type: "cutscene",
      title: "零号裁决：第一次出现",
      tags: ["mystery", "epic"],
      bg: "bg_glitch_void",
      music: "bgm_admin",
      text: [
        "世界像卡顿了一下，一个冷静到没有温度的声音响起：",
        "‘错误变量已出现。开始回收。’"
      ],
      effects: [
        { op: "add", var: "sanity", value: -3 }
      ],
      goto: "CH5_07"
    },
    {
      id: "CH5_07",
      type: "dialogue",
      title: "照月的软肋一瞬",
      tags: ["romance", "subtle"],
      bg: "bg_rooftop_wind",
      music: "bgm_soft_night",
      cast: [
        { name: "沈照月", pose: "tired" }
      ],
      text: [
        { speaker: "沈照月", line: "你刚才要是慢一秒，会死。" },
        { speaker: "顾星河", line: "你在担心我？" },
        { speaker: "沈照月", line: "……别自作多情。我只是不想欠人。" },
        { speaker: "旁白", line: "她说完这句，视线却在你衣领的血迹上停了很久。" }
      ],
      choices: [
        {
          text: "轻声：'那你欠我一次，把你自己活成你想要的样子。'",
          goto: "CH5_08",
          effects: [
            { op: "add", var: "aff_moon.bond", value: 6 },
            { op: "add", var: "aff_moon.fate", value: 3 }
          ]
        },
        {
          text: "不拆穿：'我会更强。你不用管。'",
          goto: "CH5_08",
          effects: [
            { op: "add", var: "aff_moon.trust", value: 2 },
            { op: "add", var: "aff_moon.rift", value: 1 }
          ]
        }
      ]
    },
    {
      id: "CH5_08",
      type: "dialogue",
      title: "雾音的余波动作",
      tags: ["romance", "subtle"],
      bg: "bg_apartment_kitchen_dim",
      music: "bgm_home_low",
      cast: [
        { name: "林雾音", pose: "quiet" }
      ],
      text: [
        { speaker: "旁白", line: "你回到家，桌上多了一杯温水和一盒药。没有字条。" },
        { speaker: "林雾音", line: "你别熬。你一熬夜，它就更容易找到你。" }
      ],
      effects: [
        { op: "add", var: "aff_mist.bond", value: 4 },
        { op: "add", var: "aff_mist.trust", value: 2 }
      ],
      goto: "CH5_09"
    },
    {
      id: "CH5_09",
      type: "schedule",
      title: "日程（第4天）：碎片去向抉择预备",
      tags: ["growth", "choice_prep"],
      bg: "bg_calendar_ui",
      music: "bgm_ui_soft",
      text: [
        "你获得第4天日程。你可以选择：把碎片交给实验站，或继续私藏研究。"
      ],
      effects: [
        { op: "add", var: "day", value: 1 }
      ],
      goto: "CH5_10"
    },
    {
      id: "CH5_10",
      type: "dialogue",
      title: "碎片去向（关键分歧）",
      tags: ["major_choice", "epic"],
      bg: "bg_lab_archive_room",
      music: "bgm_choice",
      cast: [
        { name: "顾星河", pose: "decide" }
      ],
      text: [
        { speaker: "旁白", line: "碎片在你掌心像一片薄薄的夜空，冷得让人清醒。" }
      ],
      choices: [
        {
          text: "交给实验站（更稳、但可能被夺）",
          goto: "CH6_01",
          effects: [
            { op: "flag", name: "gave_fragment_to_lab" },
            { op: "add", var: "sanity", value: 6 },
            { op: "add", var: "sync", value: -1 }
          ]
        },
        {
          text: "私藏碎片（更强、但污染风险）",
          goto: "CH6_01",
          effects: [
            { op: "add", var: "sync", value: 6 },
            { op: "add", var: "sanity", value: -5 },
            { op: "add", var: "cultivation", value: 2 }
          ]
        }
      ]
    },

    // =========================
    // CH6: 星封共鸣
    // =========================
    {
      id: "CH6_01",
      type: "cutscene",
      title: "十二守封者的残影",
      tags: ["epic", "lore"],
      bg: "bg_void_star_rings",
      music: "bgm_epic_lore",
      text: [
        "你在半梦半醒间看见十二道人影，围着一扇门。",
        "他们每个人都在笑，却像在诀别。"
      ],
      effects: [
        { op: "add", var: "sanity", value: -2 }
      ],
      goto: "CH6_02"
    },
    {
      id: "CH6_02",
      type: "dialogue",
      title: "零号裁决的条件",
      tags: ["mystery", "epic"],
      bg: "bg_glitch_void",
      music: "bgm_admin",
      cast: [
        { name: "零号裁决", pose: "none" }
      ],
      text: [
        { speaker: "零号裁决", line: "门将开启。你可选择：成为锁，或成为钥匙。" },
        { speaker: "零号裁决", line: "锁会痛。钥匙会忘。你愿意吗？" }
      ],
      goto: "CH6_03"
    },
    {
      id: "CH6_03",
      type: "dialogue",
      title: "照月：追溯宿命",
      tags: ["route_hook", "romance"],
      bg: "bg_rooftop_wind",
      music: "bgm_soft_night",
      cast: [
        { name: "沈照月", pose: "quiet" }
      ],
      text: [
        { speaker: "沈照月", line: "我体内有东西在醒。它不是我，但它会用我开门。" },
        { speaker: "沈照月", line: "如果你想救所有人，先救我。把我从它手里抢回来。" }
      ],
      effects: [
        { op: "add", var: "aff_moon.fate", value: 3 }
      ],
      goto: "CH6_04"
    },
    {
      id: "CH6_04",
      type: "dialogue",
      title: "雾音：先救现实",
      tags: ["route_hook", "romance"],
      bg: "bg_school_stairs_rain",
      music: "bgm_rain_close",
      cast: [
        { name: "林雾音", pose: "brave" }
      ],
      text: [
        { speaker: "林雾音", line: "裂隙在学校地下扩张。再晚一点，会有更多人走向海。" },
        { speaker: "林雾音", line: "你要真相可以等，但他们等不了。" }
      ],
      effects: [
        { op: "add", var: "aff_mist.trust", value: 2 }
      ],
      goto: "CH6_05"
    },
    {
      id: "CH6_05",
      type: "dialogue",
      title: "唐越：权限计划",
      tags: ["route_hook", "rival_romance"],
      bg: "bg_eden_private_lounge",
      music: "bgm_private_low",
      cast: [
        { name: "唐越", pose: "serious" }
      ],
      text: [
        { speaker: "唐越", line: "你想知道你父亲在哪？我能带你看到后台日志。" },
        { speaker: "唐越", line: "但你得跟我走。现在。别犹豫。" }
      ],
      effects: [
        { op: "add", var: "aff_tang.fate", value: 3 }
      ],
      goto: "CH6_06"
    },
    {
      id: "CH6_06",
      type: "battle",
      title: "门前试炼：倒映眷属",
      tags: ["battle", "epic", "pre_route"],
      bg: "bg_void_star_rings",
      music: "bgm_battle_epic",
      party: ["顾星河", "（当前最高好感同伴）", "（当前第二好感同伴）"],
      enemies: [
        { id: "E_VOID_SOLDIER", count: 2, level: 15 },
        { id: "E_ABYSS_ACOLYTE", count: 1, level: 16 }
      ],
      win_goto: "CH6_07",
      lose_goto: "CH6_06",
      battle_rules: {
        sanity_drain_per_turn: 2,
        special_triggers: [
          {
            when: "turn==2",
            action: {
              type: "dialogue_in_battle",
              text: [
                { speaker: "旁白", line: "你听见你自己的声音从敌人口中说：'放弃吧。回到倒影里。'" }
              ],
              effects: [
                { op: "add", var: "sanity", value: -2 }
              ]
            }
          }
        ]
      }
    },
    {
      id: "CH6_07",
      type: "dialogue",
      title: "路线入口选择（最终）",
      tags: ["major_choice", "route_entry"],
      bg: "bg_city_night_wet",
      music: "bgm_choice",
      cast: [
        { name: "顾星河", pose: "decide" }
      ],
      text: [
        { speaker: "旁白", line: "你站在分岔路口。每条路都通向救赎，也通向代价。" }
      ],
      choices: [
        {
          text: "跟照月走（剑与宿命线）",
          goto: "ROUTE_A_START",
          effects: [
            { op: "set", var: "chapter", value: 7 },
            { op: "add", var: "aff_moon.trust", value: 4 }
          ]
        },
        {
          text: "跟雾音走（现实与救赎线）",
          goto: "ROUTE_B_START",
          effects: [
            { op: "set", var: "chapter", value: 7 },
            { op: "add", var: "aff_mist.bond", value: 4 }
          ]
        },
        {
          text: "跟唐越走（权力与真心线）",
          goto: "ROUTE_C_START",
          effects: [
            { op: "set", var: "chapter", value: 7 },
            { op: "add", var: "aff_tang.trust", value: 4 }
          ]
        }
      ]
    },
    {
      id: "CH6_08",
      type: "cutscene",
      title: "（保留）路线序章占位",
      tags: ["placeholder"],
      bg: "bg_black",
      music: "bgm_silence",
      text: [
        "（此处开始进入各自路线章节，由后续脚本填充）"
      ]
    },
    {
      id: "CH6_09",
      type: "cutscene",
      title: "（保留）",
      tags: ["placeholder"],
      bg: "bg_black",
      music: "bgm_silence",
      text: [
        "（保留）"
      ]
    },
    {
      id: "CH6_10",
      type: "cutscene",
      title: "共通线结束",
      tags: ["end_common"],
      bg: "bg_black",
      music: "bgm_silence",
      text: [
        "共通线 CH1~CH6 完成。"
      ]
    },

    // =========================
    // ROUTE A: 照月线
    // =========================
    {
      id: "ROUTE_A_START",
      type: "cutscene",
      title: "雨夜的同路",
      tags: ["route_start", "romance", "real_world"],
      bg: "bg_rooftop_wind",
      music: "bgm_soft_night",
      text: [
        "雨像细线挂在城市的边缘，风把冷意送到你肩上。",
        "她站在屋檐下，头发湿了一点，却没躲。"
      ],
      effects: [
        { op: "set", var: "chapter", value: 7 }
      ],
      goto: "RA1_02"
    },
    {
      id: "RA1_02",
      type: "dialogue",
      title: "照月：钥匙候选",
      tags: ["romance", "high_density", "route_hook"],
      bg: "bg_rooftop_wind",
      music: "bgm_soft_night",
      cast: [
        { name: "沈照月", pose: "quiet" },
        { name: "顾星河", pose: "steady" }
      ],
      text: [
        { speaker: "沈照月", line: "我不是被选中的人。是被标记的人。" },
        { speaker: "顾星河", line: "标记？" },
        { speaker: "沈照月", line: "它把我当作钥匙候选。门不会自己开，它要借我的手。" },
        { speaker: "顾星河", line: "你害怕？" },
        { speaker: "沈照月", line: "我只是不想成为它的答案。" },
        { speaker: "顾星河", line: "那就让我成为你的答案。" },
        { speaker: "沈照月", line: "我不需要别人替我做决定。" },
        { speaker: "旁白", line: "她说得冷，眼神却有一瞬的软。那一瞬像刀背贴上皮肤。" },
        { speaker: "顾星河", line: "那我就陪你。你决定，我执行。" },
        { speaker: "沈照月", line: "……别后悔。" }
      ],
      effects: [
        { op: "add", var: "aff_moon.trust", value: 6 },
        { op: "add", var: "aff_moon.bond", value: 4 }
      ],
      goto: "RA1_03"
    },
    {
      id: "RA1_03",
      type: "schedule",
      title: "日程（第5天）：行动规划",
      tags: ["growth", "system_unlock"],
      bg: "bg_calendar_ui",
      music: "bgm_ui_soft",
      text: [
        "你获得第5天日程。建议：港口调查或修为训练。"
      ],
      effects: [
        { op: "add", var: "day", value: 1 }
      ],
      goto: "RA1_04"
    },
    {
      id: "RA1_04",
      type: "battle",
      title: "港口裂隙：倒影巡弋",
      tags: ["battle", "real_world", "horror"],
      bg: "bg_sea_black_tide",
      music: "bgm_battle_horror",
      party: ["顾星河", "沈照月", "（临时：林雾音）"],
      enemies: [
        { id: "E_MIRROR_HOUND", count: 2, level: 14 },
        { id: "E_VOID_SOLDIER", count: 1, level: 15 }
      ],
      win_goto: "RA1_05",
      lose_goto: "RA1_04",
      battle_rules: {
        sanity_drain_per_turn: 2
      }
    },
    {
      id: "RA1_05",
      type: "dialogue",
      title: "雾音的提醒",
      tags: ["real_world", "tension"],
      bg: "bg_seaside_town_evening",
      music: "bgm_sea_wind_soft",
      cast: [
        { name: "林雾音", pose: "gentle_guard" }
      ],
      text: [
        { speaker: "林雾音", line: "她看起来很稳，但稳不代表不会碎。" },
        { speaker: "顾星河", line: "我会接住她。" },
        { speaker: "林雾音", line: "接住她，也接住你自己。别让那扇门把你们都吞了。" }
      ],
      effects: [
        { op: "add", var: "aff_mist.trust", value: 2 },
        { op: "add", var: "sanity", value: 1 }
      ],
      goto: "RA1_06"
    },
    {
      id: "RA1_06",
      type: "cutscene",
      title: "灯塔碎片·其二",
      tags: ["artifact", "epic"],
      bg: "bg_lighthouse_fog",
      music: "bgm_relic",
      text: [
        "灯塔最深处有一道看不见的缝，碎片像被海浪磨过的星屑。",
        "你伸手时，掌心硬币轻响了一声。"
      ],
      effects: [
        { op: "add", var: "fragment_count", value: 1 },
        { op: "add", var: "cultivation", value: 3 }
      ],
      goto: "RA1_07"
    },
    {
      id: "RA1_07",
      type: "dialogue",
      title: "照月的旧梦",
      tags: ["romance", "character_depth"],
      bg: "bg_lighthouse_fog",
      music: "bgm_thin_dread",
      cast: [
        { name: "沈照月", pose: "pale" }
      ],
      text: [
        { speaker: "沈照月", line: "我梦见自己小时候站在门前，旁边的人都笑着。" },
        { speaker: "顾星河", line: "笑着送你进去？" },
        { speaker: "沈照月", line: "不是。像是知道我会回来。可我不记得我回来过。" }
      ],
      choices: [
        {
          text: "靠近：'你现在就在我身边。'",
          goto: "RA1_08",
          effects: [
            { op: "add", var: "aff_moon.bond", value: 4 },
            { op: "add", var: "aff_moon.trust", value: 2 }
          ]
        },
        {
          text: "克制：'先别陷在梦里，继续走。'",
          goto: "RA1_08",
          effects: [
            { op: "add", var: "aff_moon.trust", value: 3 },
            { op: "add", var: "aff_moon.rift", value: 1 }
          ]
        }
      ]
    },
    {
      id: "RA1_08",
      type: "battle",
      title: "月痕试炼：影群",
      tags: ["battle", "virtual_world"],
      bg: "bg_eden_forest_path",
      music: "bgm_battle_mid",
      party: ["顾星河", "沈照月", "（随机同伴）"],
      enemies: [
        { id: "E_VOID_SOLDIER", count: 2, level: 15 },
        { id: "E_ABYSS_ACOLYTE", count: 1, level: 16 }
      ],
      win_goto: "RA1_09",
      lose_goto: "RA1_08",
      battle_rules: {
        sanity_drain_per_turn: 1
      }
    },
    {
      id: "RA1_09",
      type: "cutscene",
      title: "候选确认",
      tags: ["epic", "mystery"],
      bg: "bg_glitch_void",
      music: "bgm_admin",
      text: [
        "她的影子在地面上短暂分裂，像被门的另一侧拉扯。",
        "你听见那声无温度的低语：'钥匙候选确认。'"
      ],
      effects: [
        { op: "flag", name: "moon_key_candidate" },
        { op: "add", var: "sanity", value: -2 }
      ],
      goto: "RA1_10"
    },
    {
      id: "RA1_10",
      type: "schedule",
      title: "日程（第6天）：修行与护身",
      tags: ["growth"],
      bg: "bg_calendar_ui",
      music: "bgm_ui_soft",
      text: [
        "你获得第6天日程。建议：提升修为或收集现实防护道具。"
      ],
      effects: [
        { op: "add", var: "day", value: 1 }
      ],
      goto: "RA2_01"
    },
    {
      id: "RA2_01",
      type: "dialogue",
      title: "剑式纠偏",
      tags: ["romance", "training"],
      bg: "bg_eden_training_yard",
      music: "bgm_training",
      cast: [
        { name: "沈照月", pose: "cold_blade" }
      ],
      text: [
        { speaker: "沈照月", line: "你出剑多半分力气，就会少半分命。" },
        { speaker: "顾星河", line: "那你呢？" },
        { speaker: "沈照月", line: "我没有命可省。" }
      ],
      effects: [
        { op: "add", var: "cultivation", value: 3 },
        { op: "add", var: "aff_moon.bond", value: 3 }
      ],
      goto: "RA2_02"
    },
    {
      id: "RA2_02",
      type: "cutscene",
      title: "禁术线索：逆命轮",
      tags: ["lore", "mystery"],
      bg: "bg_lab_archive_room",
      music: "bgm_archive",
      text: [
        "你在父亲日志夹层里发现一页：逆命轮可逆转一次代价，但会引来裁决。",
        "纸角被烧过，像有人试图抹去它。"
      ],
      effects: [
        { op: "add", var: "sync", value: 2 },
        { op: "add", var: "sanity", value: -1 }
      ],
      goto: "RA2_03"
    },
    {
      id: "RA2_03",
      type: "battle",
      title: "实验站外：追踪者",
      tags: ["battle", "real_world", "horror"],
      bg: "bg_lab_outside_fog",
      music: "bgm_battle_horror",
      party: ["顾星河", "沈照月", "（临时：保安）"],
      enemies: [
        { id: "E_SKINWALK_PROXY", count: 2, level: 16 },
        { id: "E_MIRROR_HOUND", count: 1, level: 15 }
      ],
      win_goto: "RA2_04",
      lose_goto: "RA2_03",
      battle_rules: {
        sanity_drain_per_turn: 2
      }
    },
    {
      id: "RA2_04",
      type: "dialogue",
      title: "唐越的资源",
      tags: ["rival_romance", "deal"],
      bg: "bg_eden_private_lounge",
      music: "bgm_private_low",
      cast: [
        { name: "唐越", pose: "serious_smile" }
      ],
      text: [
        { speaker: "唐越", line: "我不问你们在干什么，只问一句：需要装备吗？" },
        { speaker: "顾星河", line: "你怎么这么好心？" },
        { speaker: "唐越", line: "我不想你死得太早。" }
      ],
      choices: [
        {
          text: "接受资源",
          goto: "RA2_05",
          effects: [
            { op: "add", var: "credits", value: 300 },
            { op: "add", var: "aff_tang.trust", value: 2 }
          ]
        },
        {
          text: "拒绝：不欠人情",
          goto: "RA2_05",
          effects: [
            { op: "add", var: "aff_tang.rift", value: 2 },
            { op: "add", var: "sanity", value: 1 }
          ]
        }
      ]
    },
    {
      id: "RA2_05",
      type: "cutscene",
      title: "镜藏图书馆：碎片·其三",
      tags: ["artifact", "epic"],
      bg: "bg_mirror_library",
      music: "bgm_relic",
      text: [
        "书架像无尽的回廊，你在最深处摸到第二枚硬币的冷。",
        "碎片浮起，像一只眼睛看向你。"
      ],
      effects: [
        { op: "add", var: "fragment_count", value: 1 },
        { op: "add", var: "sync", value: 3 }
      ],
      goto: "RA2_06"
    },
    {
      id: "RA2_06",
      type: "dialogue",
      title: "照月的坦白",
      tags: ["romance", "high_density"],
      bg: "bg_mirror_library",
      music: "bgm_soft_night",
      cast: [
        { name: "沈照月", pose: "tired" },
        { name: "顾星河", pose: "steady" }
      ],
      text: [
        { speaker: "沈照月", line: "我一直以为我只会死得很安静。" },
        { speaker: "顾星河", line: "你不需要死。" },
        { speaker: "沈照月", line: "你不懂。门要开，总得有人去挡。" },
        { speaker: "顾星河", line: "那我就和你一起挡。" },
        { speaker: "沈照月", line: "你又想做英雄？" },
        { speaker: "顾星河", line: "不。我只是不想一个人留在门外。" },
        { speaker: "沈照月", line: "我怕你后悔。" },
        { speaker: "顾星河", line: "我更怕你一个人去后悔。" },
        { speaker: "旁白", line: "她沉默很久，像在把一口气重新缝回胸口。" },
        { speaker: "沈照月", line: "如果有一天我不是我了——你还会叫我回来吗？" }
      ],
      choices: [
        {
          text: "答应：'我会。哪怕全世界都忘了你。'",
          goto: "RA2_07",
          effects: [
            { op: "add", var: "aff_moon.bond", value: 8 },
            { op: "add", var: "aff_moon.fate", value: 4 }
          ]
        },
        {
          text: "现实：'我会先救你，再谈别的。'",
          goto: "RA2_07",
          effects: [
            { op: "add", var: "aff_moon.trust", value: 6 },
            { op: "add", var: "aff_moon.rift", value: 1 }
          ]
        }
      ]
    },
    {
      id: "RA2_07",
      type: "battle",
      title: "镜藏守卫：月环裁守",
      tags: ["battle", "boss", "epic"],
      bg: "bg_mirror_library",
      music: "bgm_boss_circus_dread",
      party: ["顾星河", "沈照月", "（随机同伴）"],
      enemies: [
        { id: "B_LUNAR_WARDEN", count: 1, level: 18 },
        { id: "E_VOID_SOLDIER", count: 2, level: 17 }
      ],
      win_goto: "RA2_08",
      lose_goto: "RA2_07",
      battle_rules: {
        sanity_drain_per_turn: 2,
        special_triggers: [
          {
            when: "turn==3",
            action: {
              type: "apply_status",
              target: "party_random",
              status: "HALLUCINATION",
              duration: 1
            }
          }
        ]
      }
    },
    {
      id: "RA2_08",
      type: "cutscene",
      title: "共鸣后遗症",
      tags: ["sync", "mystery"],
      bg: "bg_glitch_void",
      music: "bgm_glitch",
      text: [
        "碎片吸进她的影子里，她短暂失去声音。",
        "你感觉世界像被拉近了一寸，心跳都被放大。"
      ],
      effects: [
        { op: "add", var: "sync", value: 4 },
        { op: "add", var: "sanity", value: -2 }
      ],
      goto: "RA2_09"
    },
    {
      id: "RA2_09",
      type: "schedule",
      title: "日程（第7天）：稳住现实",
      tags: ["growth", "investigation"],
      bg: "bg_calendar_ui",
      music: "bgm_ui_soft",
      text: [
        "你获得第7天日程。建议：现实调查或照月修行。"
      ],
      effects: [
        { op: "add", var: "day", value: 1 }
      ],
      goto: "RA2_10"
    },
    {
      id: "RA2_10",
      type: "dialogue",
      title: "羁绊前兆",
      tags: ["romance", "subtle"],
      bg: "bg_rooftop_wind",
      music: "bgm_soft_night",
      cast: [
        { name: "沈照月", pose: "quiet" }
      ],
      text: [
        { speaker: "沈照月", line: "你有时看起来像把剑。锋利，但不想伤人。" },
        { speaker: "顾星河", line: "那是因为有人在我身边。" }
      ],
      effects: [
        { op: "add", var: "aff_moon.bond", value: 4 },
        { op: "add", var: "aff_moon.trust", value: 3 },
        { op: "flag", name: "moon_bond_unlocked" }
      ],
      goto: "RA3_01"
    },
    {
      id: "RA3_01",
      type: "cutscene",
      title: "黑潮再临",
      tags: ["real_world", "horror"],
      bg: "bg_sea_black_tide",
      music: "bgm_sea_dread",
      text: [
        "黑潮比上次更靠岸，浪声像被掐断的呼吸。",
        "你看到倒影在水里先一步走向你。"
      ],
      effects: [
        { op: "add", var: "sanity", value: -3 }
      ],
      goto: "RA3_02"
    },
    {
      id: "RA3_02",
      type: "dialogue",
      title: "雾音的渊标记",
      tags: ["real_world", "mystery"],
      bg: "bg_school_stairs_rain",
      music: "bgm_rain_close",
      cast: [
        { name: "林雾音", pose: "brave" }
      ],
      text: [
        { speaker: "林雾音", line: "我手腕上的印记在发热。它在回应门。" },
        { speaker: "顾星河", line: "你从没告诉过我。" },
        { speaker: "林雾音", line: "我怕你用那种眼神看我。" }
      ],
      choices: [
        {
          text: "追问真相",
          goto: "RA3_03",
          effects: [
            { op: "flag", name: "mist_mark_revealed" },
            { op: "add", var: "aff_mist.trust", value: 2 }
          ]
        },
        {
          text: "不追问：先救人",
          goto: "RA3_03",
          effects: [
            { op: "add", var: "aff_mist.bond", value: 2 },
            { op: "add", var: "aff_mist.rift", value: 1 }
          ]
        }
      ]
    },
    {
      id: "RA3_03",
      type: "battle",
      title: "地下救援：裂隙暴走",
      tags: ["battle", "real_world", "horror"],
      bg: "bg_school_underground",
      music: "bgm_battle_horror",
      party: ["顾星河", "沈照月", "林雾音"],
      enemies: [
        { id: "E_ABYSS_ACOLYTE", count: 1, level: 18 },
        { id: "E_MIRROR_HOUND", count: 2, level: 17 }
      ],
      win_goto: "RA3_04",
      lose_goto: "RA3_03",
      battle_rules: {
        sanity_drain_per_turn: 2
      }
    },
    {
      id: "RA3_04",
      type: "dialogue",
      title: "逆命轮的代价（关键分歧）",
      tags: ["major_choice", "romance", "high_density"],
      bg: "bg_school_underground",
      music: "bgm_choice",
      cast: [
        { name: "沈照月", pose: "hurt" },
        { name: "顾星河", pose: "decide" }
      ],
      text: [
        { speaker: "旁白", line: "照月的伤口在向黑雾扩散，像门在她体内呼吸。" },
        { speaker: "沈照月", line: "别救我。这样会把你拉进它的视线。" },
        { speaker: "顾星河", line: "我已经在它的视线里了。" }
      ],
      choices: [
        {
          text: "使用逆命轮救她",
          goto: "RA3_05",
          effects: [
            { op: "flag", name: "used_forbidden_art" },
            { op: "add", var: "sync", value: 8 },
            { op: "add", var: "sanity", value: -6 },
            { op: "add", var: "aff_moon.fate", value: 4 }
          ]
        },
        {
          text: "不用禁术：先封她伤势",
          goto: "RA3_05",
          effects: [
            { op: "add", var: "sanity", value: 2 },
            { op: "add", var: "aff_moon.trust", value: 4 },
            { op: "add", var: "aff_moon.rift", value: 1 }
          ]
        }
      ]
    },
    {
      id: "RA3_05",
      type: "cutscene",
      title: "钟楼碎片·其四",
      tags: ["artifact", "epic"],
      bg: "bg_old_clock_tower",
      music: "bgm_relic",
      text: [
        "钟楼深处的齿轮停在同一秒，碎片卡在时间的夹缝里。",
        "你取下它时，世界像恢复了呼吸。"
      ],
      effects: [
        { op: "add", var: "fragment_count", value: 1 },
        { op: "add", var: "cultivation", value: 3 }
      ],
      goto: "RA3_06"
    },
    {
      id: "RA3_06",
      type: "dialogue",
      title: "照月的迟疑",
      tags: ["romance", "subtle"],
      bg: "bg_rooftop_wind",
      music: "bgm_soft_night",
      cast: [
        { name: "沈照月", pose: "quiet" }
      ],
      text: [
        { speaker: "沈照月", line: "你今天的眼神……像在和什么对抗。" },
        { speaker: "顾星河", line: "我在和一扇门对抗。" }
      ],
      effects: [
        { op: "add", var: "aff_moon.trust", value: 2 }
      ],
      goto: "RA3_07"
    },
    {
      id: "RA3_07",
      type: "battle",
      title: "裁决猎人",
      tags: ["battle", "epic"],
      bg: "bg_city_night_wet",
      music: "bgm_battle_mid",
      party: ["顾星河", "沈照月", "（随机同伴）"],
      enemies: [
        { id: "E_VOID_SOLDIER", count: 2, level: 19 },
        { id: "E_SKINWALK_PROXY", count: 1, level: 19 }
      ],
      win_goto: "RA3_08",
      lose_goto: "RA3_07",
      battle_rules: {
        sanity_drain_per_turn: 2
      }
    },
    {
      id: "RA3_08",
      type: "cutscene",
      title: "零号裁决：真相一角",
      tags: ["mystery", "epic"],
      bg: "bg_glitch_void",
      music: "bgm_admin",
      text: [
        "那道声音再次出现：'错误变量过多，回收即为保全。'",
        "你第一次听懂它的逻辑——它要的是稳定，不是活人。"
      ],
      effects: [
        { op: "flag", name: "admin_truth_known" },
        { op: "add", var: "sanity", value: -2 }
      ],
      goto: "RA3_09"
    },
    {
      id: "RA3_09",
      type: "schedule",
      title: "日程（第8天）：备战门前",
      tags: ["growth"],
      bg: "bg_calendar_ui",
      music: "bgm_ui_soft",
      text: [
        "你获得第8天日程。建议：提升修为或恢复理智。"
      ],
      effects: [
        { op: "add", var: "day", value: 1 }
      ],
      goto: "RA3_10"
    },
    {
      id: "RA3_10",
      type: "dialogue",
      title: "并肩誓言",
      tags: ["romance", "epic"],
      bg: "bg_rooftop_wind",
      music: "bgm_soft_night",
      cast: [
        { name: "沈照月", pose: "soft" }
      ],
      text: [
        { speaker: "沈照月", line: "如果门前是死路，你还会来吗？" },
        { speaker: "顾星河", line: "我会。因为你在那里。" }
      ],
      effects: [
        { op: "add", var: "aff_moon.bond", value: 5 }
      ],
      goto: "RA4_01"
    },
    {
      id: "RA4_01",
      type: "cutscene",
      title: "钥匙仪式",
      tags: ["epic", "route_climax"],
      bg: "bg_void_star_rings",
      music: "bgm_epic_lore",
      text: [
        "碎片围成一圈，像一道缓慢闭合的门。",
        "照月站在中心，影子被拉得很长。"
      ],
      effects: [
        { op: "set", var: "chapter", value: 10 }
      ],
      goto: "RA4_02"
    },
    {
      id: "RA4_02",
      type: "dialogue",
      title: "最后的抉择",
      tags: ["major_choice", "high_density", "romance"],
      bg: "bg_void_star_rings",
      music: "bgm_choice",
      cast: [
        { name: "沈照月", pose: "quiet" },
        { name: "顾星河", pose: "decide" }
      ],
      text: [
        { speaker: "沈照月", line: "门要开了。你可以走。别留在我身边。" },
        { speaker: "顾星河", line: "我不走。" },
        { speaker: "沈照月", line: "那就答应我，别让它把你变成它。" }
      ],
      choices: [
        {
          text: "答应她：封门为先",
          goto: "RA4_03",
          effects: [
            { op: "add", var: "aff_moon.trust", value: 4 },
            { op: "add", var: "aff_moon.rift", value: 1 }
          ]
        },
        {
          text: "拒绝：救她为先",
          goto: "RA4_03",
          effects: [
            { op: "add", var: "aff_moon.bond", value: 5 },
            { op: "add", var: "aff_moon.fate", value: 3 }
          ]
        }
      ]
    },
    {
      id: "RA4_03",
      type: "battle",
      title: "门前试炼：虚渊守军",
      tags: ["battle", "epic"],
      bg: "bg_void_star_rings",
      music: "bgm_battle_epic",
      party: ["顾星河", "沈照月", "（当前最高好感同伴）"],
      enemies: [
        { id: "E_VOID_SOLDIER", count: 2, level: 20 },
        { id: "E_ABYSS_ACOLYTE", count: 1, level: 21 }
      ],
      win_goto: "RA4_04",
      lose_goto: "RA4_03",
      battle_rules: {
        sanity_drain_per_turn: 2
      }
    },
    {
      id: "RA4_04",
      type: "cutscene",
      title: "门半开",
      tags: ["epic", "mystery"],
      bg: "bg_glitch_void",
      music: "bgm_admin",
      text: [
        "门只开了一半，另一半像被谁死死按住。",
        "你听见门后是风，也像是人潮。"
      ],
      effects: [
        { op: "add", var: "sanity", value: -2 }
      ],
      goto: "RA4_05"
    },
    {
      id: "RA4_05",
      type: "dialogue",
      title: "誓约",
      tags: ["major_choice", "route_gate"],
      bg: "bg_void_star_rings",
      music: "bgm_choice",
      cast: [
        { name: "顾星河", pose: "decide" }
      ],
      text: [
        { speaker: "旁白", line: "你感觉自己被门的引力拉扯。你必须给出誓约。" }
      ],
      choices: [
        {
          text: "OATH = SEAL（封印为先）",
          goto: "RA4_06",
          effects: [
            { op: "set", var: "oath", value: "SEAL" },
            { op: "add", var: "sanity", value: 2 }
          ]
        },
        {
          text: "OATH = DESCEND（坠入门内）",
          goto: "RA4_06",
          effects: [
            { op: "set", var: "oath", value: "DESCEND" },
            { op: "add", var: "sync", value: 4 }
          ]
        }
      ]
    },
    {
      id: "RA4_06",
      type: "battle",
      title: "终战：零号裁决·代理体",
      tags: ["battle", "boss", "epic"],
      bg: "bg_glitch_void",
      music: "bgm_battle_epic",
      party: ["顾星河", "沈照月", "（当前最高好感同伴）"],
      enemies: [
        { id: "B_ZERO_PROXY", count: 1, level: 23 },
        { id: "E_ABYSS_ACOLYTE", count: 2, level: 22 }
      ],
      win_goto: "RA4_07",
      lose_goto: "RA4_06",
      battle_rules: {
        sanity_drain_per_turn: 3,
        special_triggers: [
          {
            when: "turn==2",
            action: {
              type: "apply_status",
              target: "party_all",
              status: "EROSION",
              duration: 2
            }
          }
        ]
      }
    },
    {
      id: "RA4_07",
      type: "cutscene",
      title: "门后的风",
      tags: ["epic", "romance"],
      bg: "bg_void_star_rings",
      music: "bgm_soft_night",
      text: [
        "风从门后扑出，又被你们合力按回去。",
        "照月的手很冷，却没有放开。"
      ],
      effects: [
        { op: "add", var: "aff_moon.bond", value: 6 }
      ],
      goto: "RA4_08"
    },
    {
      id: "RA4_08",
      type: "dialogue",
      title: "照月的回应",
      tags: ["romance", "subtle"],
      bg: "bg_rooftop_wind",
      music: "bgm_soft_night",
      cast: [
        { name: "沈照月", pose: "soft" }
      ],
      text: [
        { speaker: "沈照月", line: "我以为我只会是钥匙。" },
        { speaker: "顾星河", line: "你也是你自己。" },
        { speaker: "沈照月", line: "那我就试着……为自己活一次。" }
      ],
      effects: [
        { op: "flag", name: "route_a_complete" }
      ],
      goto: "RA4_09"
    },
    {
      id: "RA4_09",
      type: "cutscene",
      title: "路线收束占位",
      tags: ["placeholder"],
      bg: "bg_black",
      music: "bgm_silence",
      text: [
        "（此处进入终章汇流或共通终局）"
      ],
      goto: "RA4_10"
    },
    {
      id: "RA4_10",
      type: "cutscene",
      title: "照月线完成",
      tags: ["end_route"],
      bg: "bg_black",
      music: "bgm_silence",
      text: [
        "照月线剧情完成。"
      ]
    }
  ]
};
