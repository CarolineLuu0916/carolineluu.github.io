/* AI Trends — 行业日报数据（最新在前）
   每日更新方法见 README.md：让 Claude Code 调研后重写本文件即可 */
window.AIT_REPORTS = [
  {
    date: "2026-06-22", vol: "VOL.012", weekday: "周一",
    headline: "AI Agent行业动态：云服务商加速布局，开源生态持续升温（6.22）",
    tldr: "云服务商加速布局AI Agent，开源生态持续升温，行业进入快速发展期。",
    vane: [
      { label: "云服务", dir: "up", note: "云服务商加速布局AI Agent，推动行业快速发展。" },
      { label: "开源生态", dir: "up", note: "开源生态持续升温，促进AI技术交流与创新。" },
      { label: "AI应用", dir: "up", note: "AI agent应用多点开花，B端商业化加速。" }
    ],
    items: [
      {
        region: "海外", tag: "gl",
        title: "云服务商加速布局AI Agent（6.22）",
        what: "云服务商加速布局AI Agent，推动行业快速发展。",
        detail: "腾讯云与沙特电信服务商联手推出走进沙特计划，打造新型云服务平台。华为云在埃及设立数据中心，发布千亿参数阿拉伯语大模型。阿里云宣布在韩国、马来西亚、菲律宾、泰国、墨西哥投资建设数据中心。",
        why: "云服务商通过开拓海外市场，缓解国内竞争压力，提升品牌国际影响力。", url: "https://www.xiaoyuzhoufm.com/episode/66b4760078f788007aa283ed"
      },
      {
        region: "海外", tag: "gl",
        title: "开源生态持续升温（6.22）",
        what: "开源生态持续升温，促进AI技术交流与创新。",
        detail: "cloud MCP等agent链接协议火热，打通数据墙，提高数据流动效率。多个开源框架star逐步上涨，开发者积极探索。",
        why: "开源生态的持续升温有助于AI技术的交流与创新，加速AI agent技术发展。", url: "https://www.xiaoyuzhoufm.com/episode/675afef01dac43ba8403ac3f"
      },
      {
        region: "中国", tag: "cn",
        title: "AI agent应用多点开花（6.22）",
        what: "AI agent应用将在2025年多点开花，B端商业化加速。",
        detail: "AI agent有望在B端率先商业化，电商营销、CRM、金融法律等场景快速落地。伴随国内外巨头大模型持续迭代，C端或迎来杀手级应用。",
        why: "AI agent在B端的商业化加速，将推动AI技术在更多场景的应用落地。", url: "https://www.xiaoyuzhoufm.com/episode/67caf576e924d4525a02600e"
      },
      {
        region: "生态", tag: "eco",
        title: "AI大模型迭代加速AI应用场景落地（6.22）",
        what: "国产大模型迭代加速，AI应用场景落地加速。",
        detail: "KimiK2性能惊艳全球、通义千问3发布，智谱GLM4.5国产综合测批第一，豆包大模型AI编程日均tokens消耗量上半年增长8.4倍。",
        why: "国产大模型的快速迭代加速了AI技术在广告、电商、游戏、影视、教育等音视频领域的应用落地。", url: "http://mp.weixin.qq.com/s?__biz=MzkwMjA4NTUyMg==&mid=2247550532&idx=2&sn=6cd197d7ffa2be95bbe39e747d568206"
      }
    ],
    papers: [

    ]
  },
  {
    date: "2026-06-21", vol: "VOL.011", weekday: "周日",
    headline: "AI Agent行业动态：技术与场景深度融合，头部效应加剧（6.21）",
    tldr: "2026年6月21日，AI Agent行业呈现出技术与场景深度融合、头部效应加剧的趋势。Arcee.ai发布AFM-4.5B基础模型，注重实际性能与企业级应用。Adobe开源实时视频蒸馏模型Self-Forcing。vLLM项目GitHub星标突破5万。英伟达Vera CPU正式量产，专为Agentic AI时代设计。",
    vane: [
      { label: "技术融合", dir: "up", note: "AI技术与行业场景的深度融合，推动专业化、垂直化发展。" },
      { label: "头部集中", dir: "up", note: "资本向顶尖玩家集中，头部效应加剧，形成'赢家通吃'格局。" },
      { label: "开源生态", dir: "up", note: "开源项目如vLLM、Self-Forcing受到社区广泛认可，推动AI技术普及。" }
    ],
    items: [
      {
        region: "海外", tag: "gl",
        title: "Arcee.ai发布AFM-4.5B基础模型，注重实际性能与企业级应用（6.21）",
        what: "Arcee.ai宣布推出Arcee基础模型（AFM）家族，首款为AFM-4.5B。",
        detail: "AFM-4.5B专为实际应用性能设计，号称GPU级结果，CPU级效率，注重企业隐私、合规及西方监管。模型经过后训练，擅长推理、代码、RAG和智能体任务，计划于7月以CC BY-NC许可证开放权重。",
        why: "AFM-4.5B的发布，标志着AI基础模型向企业级应用的进一步拓展，有助于推动AI技术在企业核心场景的落地。", url: "https://www.zaowu.world/ai-daily/202606042205-1780581916.html"
      },
      {
        region: "海外", tag: "os",
        title: "Adobe开源实时视频蒸馏模型Self-Forcing（6.21）",
        what: "Adobe开源了其从Wan 2.1蒸馏而来的实时视频模型Self-Forcing。",
        detail: "Self-Forcing模型实现了实时视频生成，Hugging Face上已有用户构建了实时演示Demo。这标志着开源社区在实时视频生成能力上又迈进一步，为开发者提供了新的工具和研究基础。",
        why: "开源实时视频蒸馏模型的发布，将进一步推动视频生成技术的普及和应用，为开发者提供更多创新可能。", url: "https://www.zaowu.world/ai-daily/202606042205-1780581916.html"
      },
      {
        region: "开源", tag: "os",
        title: "vLLM项目GitHub星标突破5万（6.21）",
        what: "vLLM项目在GitHub上获得了超过5万星标。",
        detail: "vLLM项目致力于为用户提供便捷、快速且经济的LLM服务解决方案，其在GitHub上的高星标显示了其在LLM服务和推理优化领域的受欢迎程度和社区认可度。",
        why: "vLLM项目的高星标，反映了开源社区对LLM服务和推理优化解决方案的强烈需求，将进一步推动相关技术的发展和应用。", url: "https://www.zaowu.world/ai-daily/202606042205-1780581916.html"
      },
      {
        region: "海外", tag: "gl",
        title: "英伟达Vera CPU正式量产，专为Agentic AI时代设计（6.21）",
        what: "英伟达近日正式向多家顶级AI公司交付首批Vera CPU。",
        detail: "Vera基于自研Olympus架构，集成88个自定义核心，支持1.8TB/s NVLink-C2C带宽和1.5TB系统内存，性能较上一代Grace提升50%，将成为Rubin平台核心组件。",
        why: "Vera CPU的量产，标志着英伟达在Agentic AI时代的布局进一步深化，将为AI Agent行业提供更强大的硬件支持。", url: "https://www.aitrend.us/"
      }
    ],
    papers: [

    ]
  },
  {
    date: "2026-06-20", vol: "VOL.010", weekday: "周六",
    headline: "AI Agent行业动态：云服务商赋能企业构建AI智能体",
    tldr: "云服务商如谷歌和亚马逊通过提供AI Agent Builder等工具，推动AI能力产品化、工具化，降低企业构建AI智能体的门槛。AI Agent行业正从实验室走向实际应用，成为全球科技竞争焦点。",
    vane: [
      { label: "云服务", dir: "up", note: "云服务商通过AI Agent Builder等工具赋能企业构建AI智能体，推动AI能力产品化、工具化。" },
      { label: "AI Agent应用", dir: "up", note: "AI Agent从实验室走向实际应用，成为全球科技竞争焦点。" },
      { label: "AI Agent商业化", dir: "up", note: "AI Agent在toB领域已实现商业化，toC领域突破尚需时间。" }
    ],
    items: [
      {
        region: "海外", tag: "gl",
        title: "谷歌Vertex AI Agent Builder赋能企业构建AI智能体（6.20）",
        what: "谷歌Vertex AI Agent Builder代表了大型云服务商将先进AI能力产品化、工具化的趋势。",
        detail: "谷歌Vertex AI Agent Builder为企业提供了一个强大且相对易用的平台，以利用生成式AI提升效率和创新业务。",
        why: "这表明云服务商正在通过提供易用的工具和平台，推动AI能力的普及和应用，降低企业构建AI智能体的门槛。", url: "http://mp.weixin.qq.com/s?__biz=MzIxNTY4NzIyNw==&mid=2247501562&idx=1&sn=6d8ad1b1c7cd7323415abf6d5fa777c5"
      },
      {
        region: "海外", tag: "gl",
        title: "亚马逊推出Amazon Bedrock Agents降低AI应用门槛（6.20）",
        what: "亚马逊云科技 (AWS) 提供的Amazon Bedrock Agents旨在帮助开发者轻松构建、部署和管理基于生成式AI的智能体。",
        detail: "Amazon Bedrock Agents是Amazon Bedrock平台的一部分，提供对来自多家领先AI公司以及亚马逊自身的高性能基础模型的访问。",
        why: "亚马逊通过Bedrock Agents进一步降低了企业利用生成式AI构建复杂应用的门槛，使开发者能够创建可以执行任务、回答问题并与企业数据和系统交互的AI智能体。", url: "http://mp.weixin.qq.com/s?__biz=MzUxNTM5NjUyNg==&mid=2247507433&idx=1&sn=46676dc1734a1d64f873b0790f3bada1"
      },
      {
        region: "中国", tag: "cn",
        title: "第四范式转型AI Agent服务商引领行业趋势（6.20）",
        what: "第四范式从机器学习平台转型为AI Agent服务商，发布医疗行业AI智能体解决方案。",
        detail: "第四范式提出'Agent负责沟通需求，世界模型解决垂直问题'的双核架构，通过'AI Agent+医疗行业模型'为医疗机构提供全方位智能升级。",
        why: "第四范式的转型和业务迭代反映了AI Agent在垂直领域的商业化落地潜力，AI Agent能够针对固定场景进行深度优化，推动产业效率革命。", url: "http://mp.weixin.qq.com/s?__biz=MzU5NzEyMDMzNw==&mid=2247530569&idx=1&sn=c028476ac0d06c9921a8f7a1a4ee833a"
      },
      {
        region: "海外", tag: "gl",
        title: "AI Agent成为AI落地的主力军（6.20）",
        what: "2025年，AI Agent将成为AI落地的主力军，具备'感知-决策-行动-复盘'闭环能力的智能体将走进千行百业。",
        detail: "AI Agent将成为AI落地的主力军，以具备闭环能力的智能体为代表，推动产业效率革命。未来用户会需要多个专业AI Agent，每个Agent针对不同场景和需求。",
        why: "AI Agent将成为AI技术落地的关键载体，推动AI技术在各行各业的广泛应用，提升产业效率和智能化水平。", url: "http://mp.weixin.qq.com/s?__biz=MzU0OTA4MTc2NA==&mid=2247591036&idx=1&sn=ebdceca9815f17fd7c41708002add71a"
      }
    ],
    papers: [

    ]
  },
  {
    date: "2026-06-19", vol: "VOL.009", weekday: "周五",
    headline: "AI Agent行业动态：技术演进与商业模式创新并进（6.19）",
    tldr: "过去24小时内，全球AI Agent行业呈现技术演进与商业模式创新并进的态势。全球电商市场增长放缓，AI Agent技术重塑内容生产；多模态能力成为新一代Agent框架的标配；RPA市场在Agent影响下孕育新商业模式。",
    vane: [
      { label: "gl", dir: "up", note: "全球AI Agent市场规模预计将在2030年突破470亿美元，技术范式实现从规则驱动到意图驱动的转变。" },
      { label: "gl", dir: "up", note: "AI框架正从简单的任务执行向复杂决策、端到端、多模态方向演进，Agent框架技术持续进步。" },
      { label: "gl", dir: "up", note: "RPA市场在Agent的深度影响下，正孕育出前所未有的商业模式，开启全新发展篇章。" }
    ],
    items: [
      {
        region: "海外", tag: "gl",
        title: "全球电商市场增长放缓AI Agent技术重塑内容生产（6.19）",
        what: "全球电商市场正迈入增速放缓但门槛提高的长期结构性渗透阶段，预计2025年销售额将达6.86万亿美元，2027年有望突破8万亿。",
        detail: "行业呈现三大新趋势：生成式AI重塑内容生产、移动电商贡献73%的交易额、社交电商成为主流转化路径。全球营销投放大盘显示，西欧与北美仍是核心投放市场；由于流量成本攀升，广告竞争已转向存量素材的深度经营，素材生命周期显著延长。品牌出海应关注履约效率与品牌长期化，通过移动优先体验与社交信任机制抢占全球增长红利。",
        why: "这一趋势表明，AI Agent技术在电商领域的应用将进一步深化，推动内容生产方式的变革，为品牌出海提供新的增长点。", url: "https://www.huxiu.com/article/4829392.html"
      },
      {
        region: "海外", tag: "gl",
        title: "AI框架向复杂决策多模态方向演进（6.19）",
        what: "智能体框架正从简单的任务执行向复杂决策、端到端、多模态方向演进。",
        detail: "新一代Agent框架如Qwen-Agent正积极整合文本、图像、音频和视频处理能力，使智能体能够理解和生成多种媒体形式的内容。Google的Gemini 2.5系列已经在跨模态处理与响应速度方面取得显著提升，实现了统一嵌入表示与跨模态注意力机制。端到端训练方法直接将模型从问题训练到最终报告，错误率大幅降低76%。",
        why: "这一演进趋势意味着AI Agent框架将能够处理更复杂的任务，提升性能和用户体验，为多模态应用提供更强大的技术支持。", url: "http://mp.weixin.qq.com/s?__biz=MzE5MTEwNjgxNw==&mid=2247484326&idx=4&sn=18abd0cdd2db6af1483dce94392b3074"
      },
      {
        region: "海外", tag: "gl",
        title: "RPA市场孕育新商业模式（6.19）",
        what: "历经多年发展的RPA市场，在Agent的深度影响下，正孕育出前所未有的商业模式，开启全新的发展篇章。",
        detail: "市场研究权威机构Gartner将Agentic AI列为2025年十大技术趋势之一，并预测到2028年，至少15%的日常工作决策将借助Agentic AI自主完成。从IDC报告中，我们能够敏锐洞察到Agent自主决策能力向高阶迈进、垂直化与专业化Agent加速融合、企业级Agent市场爆发式增长等诸多趋势已初露端倪。",
        why: "RPA市场在Agent技术的影响下，将迎来新商业模式的孕育，推动企业智能化市场的快速发展。", url: "http://mp.weixin.qq.com/s?__biz=MzUyNDE4NDE1Mg==&mid=2247502458&idx=1&sn=ba84cdbc59f271f4200378c5636aee2e"
      },
      {
        region: "中国", tag: "cn",
        title: "AI交易员上线带火金融IT板块（6.19）",
        what: "6月19日早盘，金融IT板块紧跟CPO板块领跑全市场。",
        detail: "据分析原因可能是继私募基金上线AI基金经理之后，公募基金近日也正式推出了AI交易员新政。全球日前宣布旗下AI交易员正式上线，成为首家将AI技术应用于资金交易领域的基金公司。",
        why: "AI交易员的上线不仅推动了金融IT板块的增长，也标志着AI技术在金融交易领域的应用迈入了新的阶段。", url: "https://www.xiaoyuzhoufm.com/episode/64906370932f350aae9e5204"
      },
      {
        region: "开源", tag: "os",
        title: "全球50%以上Llama开发者转向DeepSeek（6.19）",
        what: "全球50%以上Llama开发者转向DeepSeek，Meta被迫加速Llama 4研发。",
        detail: "硬件依赖下降：低成本模型降低了对高端GPU的依赖，部分场景可用CPU替代。开源生态重构：全球50%以上Llama开发者转向DeepSeek，Meta被迫加速Llama 4研发。",
        why: "这一转变表明DeepSeek在开源社区的影响力日益增强，可能会对Meta的Llama项目产生一定的竞争压力。", url: "http://mp.weixin.qq.com/s?__biz=Mjc1NjM3MjY2MA==&mid=2691557310&idx=1&sn=b67b1911d9c2597309056520f6464d8b"
      }
    ],
    papers: [

    ]
  },
  {
    date: "2026-06-18", vol: "VOL.008", weekday: "周四",
    headline: "AI Agent行业竞争加剧与技术前沿并进（6.18）",
    tldr: "AI Agent行业在2026年迎来激烈竞争和技术创新。科技巨头和初创公司在多条战线上展开竞争，市场整合和估值泡沫成为行业关注点。同时，AI Agent技术趋势指向多智能体协作和跨模态理解，预示着行业新的发展机遇。",
    vane: [
      { label: "竞争态势", dir: "up", note: "AI Agent领域的竞争正变得日益复杂，多条战线并进。" },
      { label: "技术趋势", dir: "up", note: "多智能体协作和跨模态理解成为AI Agent技术发展的新趋势。" },
      { label: "市场整合", dir: "up", note: "预计2026至2027年，AI Agent市场将迎来一波整合浪潮。" },
      { label: "估值泡沫", dir: "down", note: "市场存在估值泡沫风险，可能导致资本从追逐概念转向寻求实际收入和成熟产品的公司。" }
    ],
    items: [
      {
        region: "海外", tag: "gl",
        title: "AI Agent领域竞争加剧（6.18）",
        what: "AI Agent领域的竞争正变得日益复杂，呈现出多条战线并进的态势。",
        detail: "科技巨头如AWS、Databricks和Google等构建自己的智能体框架和解决方案，初创公司必须通过技术护城河、专有数据、独特行业工作流或开发者社区来避免被边缘化。同时，初创公司之间在垂直领域如AI医疗文书的竞争也在迅速加剧。",
        why: "这意味着AI Agent行业的竞争格局变得更加复杂，初创公司需要在多个维度上构建竞争力，以应对来自科技巨头的挑战。", url: "http://mp.weixin.qq.com/s?__biz=MzkxODcwNzIyMw==&mid=2247485466&idx=1&sn=44759522ea3bb247941098792cb84be1"
      },
      {
        region: "中国", tag: "cn",
        title: "阿里巴巴调整AI相关组织管理架构（6.18）",
        what: "阿里巴巴宣布合并通义大模型事业部和未来生活实验室，成立Token Foundry事业部。",
        detail: "阿里巴巴集团CEO吴泳铭直接负责新成立的Token Foundry事业部，周靖人将担任阿里巴巴首席科学家，牵头成立阿里巴巴AI未来研究院，专注前沿AI科技的探索与突破。",
        why: "这一调整显示了阿里巴巴在AI领域的战略布局和对AI未来趋势的重视，将进一步推动公司在AI领域的研发和商业化进程。", url: "https://www.caixin.com/2026-06-11/102453037.html?originReferrer=kimi"
      },
      {
        region: "开源", tag: "os",
        title: "开源力量在AI Agent领域不断涌现（6.18）",
        what: "开源力量在AI Agent领域不断涌现，对商业产品构成压力。",
        detail: "随着开源AI技术的快速发展，越来越多的开源项目和社区开始涌现，为AI Agent领域带来新的活力和竞争。这些开源项目不仅推动了技术的创新，也为商业产品带来了挑战。",
        why: "开源项目的兴起为AI Agent行业带来了新的技术和解决方案，同时也加剧了行业的竞争，推动了技术的快速迭代和创新。", url: "https://mdnice.com/writing/0afe33f3a6714466aa894474a2c7f81b"
      },
      {
        region: "生态", tag: "eco",
        title: "AI Agent技术趋势指向多智能体协作（6.18）",
        what: "AI Agent技术趋势指向多智能体协作和跨模态理解。",
        detail: "随着AI技术的发展，多智能体协作和跨模态理解成为新的技术趋势。这些技术的发展将大幅提升复杂任务处理能力，拓展实时应用场景，并加速产业数字化转型。",
        why: "这一技术趋势预示着AI Agent行业将迎来新的发展机遇，同时也对行业参与者提出了更高的技术要求和挑战。", url: "https://mdnice.com/writing/0afe33f3a6714466aa894474a2c7f81b"
      }
    ],
    papers: [

    ]
  },
  {
    date: "2026-06-17", vol: "VOL.007", weekday: "周三",
    headline: "AI Agent行业竞争加剧与技术前沿并进（6.17）",
    tldr: "随着AI Agent领域的竞争日益复杂，初创公司与科技巨头间的阵地战、初创公司间的垂直赛道竞争以及赢得用户信任的挑战成为行业焦点。同时，市场整合、估值泡沫风险和跨智能体协作技术成为未来发展的关键。",
    vane: [
      { label: "竞争态势", dir: "up", note: "AI Agent领域竞争加剧，多线战争态势明显。" },
      { label: "市场整合", dir: "up", note: "预计2026至2027年市场将迎来整合浪潮，大型基础模型公司可能收购垂直智能体公司。" },
      { label: "技术前沿", dir: "up", note: "跨智能体协作成为下一个技术挑战和投资机遇。" },
      { label: "估值泡沫", dir: "down", note: "市场存在估值泡沫风险，可能导致资本流向转变。" }
    ],
    items: [
      {
        region: "海外", tag: "gl",
        title: "AI Agent领域竞争态势加剧（6.17）",
        what: "AI Agent领域的竞争正变得日益复杂，呈现出多条战线并进的态势。",
        detail: "初创公司与科技巨头的阵地战、初创公司之间的垂直赛道竞争以及赢得用户信任的挑战成为行业焦点。科技巨头如AWS、Databricks和Google等构建自己的智能体框架和解决方案，初创公司必须通过构建技术护城河、积累专有数据、打造行业工作流或建立开发者社区来保持竞争力。",
        why: "产品经理需要关注如何在激烈的竞争中找到差异化优势，构建技术壁垒和用户信任。", url: "https://mp.weixin.qq.com/s?__biz=MzkxODcwNzIyMw==&mid=2247485466&idx=1&sn=44759522ea3bb247941098792cb84be1"
      },
      {
        region: "海外", tag: "gl",
        title: "AI Agent市场整合与估值泡沫风险（6.17）",
        what: "预计2026至2027年，AI Agent市场将迎来整合浪潮，同时存在估值泡沫风险。",
        detail: "大型基础模型公司可能会收购成功的垂直智能体公司以快速获取行业知识和市场渠道。同时，传统企业软件巨头也可能通过并购来增强自身的AI Agent能力。像Thinking Machines Lab这样在产品问世前就获得百亿美元级别的估值，给市场带来了系统性风险。",
        why: "产品经理需关注市场整合趋势和估值泡沫风险，为产品定位和投资决策提供依据。", url: "https://mp.weixin.qq.com/s?__biz=MzkxODcwNzIyMw==&mid=2247485466&idx=1&sn=44759522ea3bb247941098792cb84be1"
      },
      {
        region: "海外", tag: "gl",
        title: "跨智能体协作技术成为下一个前沿（6.17）",
        what: "下一个重大的技术挑战和投资机遇将在于多智能体系统（Multi-Agent Systems）。",
        detail: "当前多数智能体仍是“单兵作战”。未来的技术挑战在于让来自不同供应商的专业智能体能够相互沟通、协调和合作，以完成更复杂的任务。这需要新的通信协议、编排平台和治理框架。",
        why: "产品经理需关注多智能体系统的发展趋势，探索新的合作模式和技术解决方案。", url: "https://mp.weixin.qq.com/s?__biz=MzkxODcwNzIyMw==&mid=2247485466&idx=1&sn=44759522ea3bb247941098792cb84be1"
      },
      {
        region: "中国", tag: "cn",
        title: "阿里巴巴调整AI相关组织管理架构（6.17）",
        what: "阿里巴巴宣布合并通义大模型事业部和未来生活实验室，成立Token Foundry事业部。",
        detail: "阿里巴巴集团CEO吴泳铭直接负责新成立的Token Foundry事业部，同时周靖人将担任阿里巴巴首席科学家，牵头成立阿里巴巴AI未来研究院，专注前沿AI科技的探索与突破。",
        why: "这一调整显示了阿里巴巴在AI领域的战略布局和对未来技术趋势的重视，产品经理需关注其对行业的影响和合作机会。", url: "https://www.caixin.com/2026-06-11/102453037.html?originReferrer=kimi"
      },
      {
        region: "生态", tag: "eco",
        title: "AI Agent行业生态多样化发展（6.17）",
        what: "AI Agent行业生态呈现多样化发展，包括通用自动化Agent、教育、音乐、PPT智能生成等多个领域。",
        detail: "各领域功能趋势、市场阶段、典型产品及机会与挑战均有所不同。例如，通用自动化Agent从开发者工具向商业产品转化，教育领域AI个性化教育需求增长，音乐领域AI音乐生成从实验向实用化转变等。",
        why: "产品经理需关注AI Agent行业生态的多样化发展，把握不同领域的发展趋势和机会。", url: "https://mp.weixin.qq.com/s?__biz=MjM5MzIyOTEzOA==&mid=2447678604&idx=1&sn=08ae053d3fa443ed40e76554f804552c"
      }
    ],
    papers: [

    ]
  },
  {
    date: "2026-06-16", vol: "VOL.006", weekday: "周二",
    headline: "AI Agent 行业监管与生态扩张双轮驱动（6.16）",
    tldr: "最近24小时，AI Agent行业在监管框架和开源生态方面取得显著进展。香港加密货币市场监管框架逐步清晰，推动行业规范化发展；国产大模型Skywork o1引领开源生态扩张，加速国产替代；中国大模型企业密集出海试水，加速AI技术国际市场布局；华为昇腾生态构建初见成效，预计2025年伙伴数量将突破1000家。这些进展表明，AI Agent行业正迎来监管与生态扩张的双轮驱动。",
    vane: [
      { label: "监管框架", dir: "up", note: "香港加密货币市场监管框架逐步清晰，为行业规范化奠定基础。" },
      { label: "开源生态", dir: "up", note: "国产大模型Skywork o1引领开源生态扩张，加速国产替代。" },
      { label: "大模型应用", dir: "up", note: "中国大模型企业密集出海试水，加速AI技术国际市场布局。" },
      { label: "生态合作", dir: "up", note: "华为昇腾生态构建初见成效，预计2025年伙伴数量将突破1000家。" }
    ],
    items: [
      {
        region: "海外", tag: "gl",
        title: "香港加密货币市场监管框架逐步清晰（6.16）",
        what: "今年5月，《稳定币发行人条例草案》获香港立法会通过，将于8月1日正式生效。该法案要求稳定币发行人须向金管局申领牌照，并严格遵守储备金管理及赎回规则。",
        why: "此举为香港加密货币市场规范化发展奠定基础，有助于提升行业信任度和稳定性，吸引更多机构和人才加入。"
      },
      {
        region: "中国", tag: "cn",
        title: "国产大模型Skywork o1引领开源生态扩张（6.16）",
        what: "昆仑万维发布升级版Skywork o1模型，成为国内首个具备中文逻辑推理能力的开源大模型。其核心优势包括性能领先、生态扩展，已孵化出200余个垂直场景应用。",
        why: "Skywork o1的开源生态扩张，有望加速国产AI基础设施的替代进程，推动国内AI技术在政务、医疗等敏感领域的应用。"
      },
      {
        region: "中国", tag: "cn",
        title: "中国大模型企业密集出海试水（6.16）",
        what: "国内人工智能大模型技术不断成熟，应用场景不断扩张。中国大模型企业都在将AI技术推向国际市场，特别是东南亚地区。",
        why: "中国大模型企业的密集出海试水，有助于提升国内AI技术的国际影响力，拓展更广阔的市场空间。"
      },
      {
        region: "中国", tag: "eco",
        title: "华为昇腾生态构建初见成效（6.16）",
        what: "华为预计，2025年昇腾生态伙伴数量将突破1000家，覆盖80%以上的AI应用场景。",
        why: "昇腾生态的快速扩张，彰显华为技术自主化的决心，为计算机行业的技术迭代与生态整合提供新动能。"
      }
    ]
  },
  {
    date: "2026-06-15", vol: "VOL.005", weekday: "周一",
    headline: "AI Agent 行业迎来监管与技术双重突破（6.15）",
    tldr: "<b>监管框架</b>与<b>开源生态</b>加速落地，<b>企业级应用</b>进入规模化阶段。",
    vane: [
      { label: "监管框架", dir: "up", note: "监管框架的完善为AI Agent行业提供了规范化发展的环境，有利于行业长期健康发展。" },
      { label: "开源生态", dir: "up", note: "开源生态的建设有助于降低企业使用AI Agent的门槛，推动技术的快速迭代和应用普及。" },
      { label: "企业级应用", dir: "up", note: "企业级AI Agent应用的规模化落地，标志着AI技术在实际业务中的价值得到进一步认可和发挥。" }
    ],
    items: [
      {
        region: "中国", tag: "cn",
        title: "思迈特SmartBI白泽V5正式发布，推动企业级智能数据分析行业进入规模化复制、标准化应用新阶段（6.15）",
        what: "思迈特软件正式发布了SmartBI白泽V5，标志着国内企业级智能数据分析行业从概念探索迈向规模化复制、标准化应用的新阶段。",
        why: "白泽V5的发布，不仅代表了思迈特产品迭代的重要里程碑，也为国内企业数据智能产业发展注入新动能，有助于企业释放数据价值，实现高质量稳健发展。"
      },
      {
        region: "海外", tag: "gl",
        title: "Gartner报告：超过65%的大型企业已在实际业务中部署了AI Agent（6.15）",
        what: "根据Gartner的最新报告，超过65%的大型企业已在实际业务中部署了AI Agent，较去年的32%翻了一番。",
        why: "这一数据表明AI Agent在企业级应用中的普及率显著提高，企业对于AI技术的接受度和依赖度不断增强，预示着AI技术在企业数字化转型中将发挥更加重要的作用。"
      },
      {
        region: "海外", tag: "gl",
        title: "金融行业AI Agent应用场景不断拓展（6.15）",
        what: "金融业作为AI Agent渗透率最高的行业之一，具体应用场景包括智能风控Agent、合规审查Agent和投研辅助Agent等。",
        why: "金融行业对AI Agent的应用不断深化，不仅提升了业务效率，还降低了风险，这将进一步推动AI技术在金融领域的广泛应用和创新。"
      },
      {
        region: "海外", tag: "gl",
        title: "医疗领域AI Agent落地取得关键进展（6.15）",
        what: "2026年医疗领域AI Agent的落地取得关键进展，包括病历摘要Agent、药物相互作用检测Agent和影像初筛Agent等。",
        why: "医疗领域对AI Agent的落地最为审慎，此次取得的关键进展意味着AI技术在医疗行业的应用潜力得到进一步释放，有望为医疗服务带来更多创新和改进。"
      },
      {
        region: "开源", tag: "os",
        title: "AI Agent技术栈形成相对标准化的架构（6.15）",
        what: "2026年的AI Agent技术栈已形成相对标准化的架构，包括Agent框架、工具集成、记忆管理和多Agent协作等方面。",
        why: "技术栈的标准化有助于降低企业开发和部署AI Agent的复杂度，加速技术的普及和应用，同时也为行业提供了统一的技术交流和协作基础。"
      }
    ]
  },
  {
    date: "2026-06-14", vol: "VOL.004", weekday: "周日",
    headline: "AI Agent 行业迎来市场化与监管新阶段（6.14）",
    tldr: "过去24小时，AI Agent 行业动态聚焦于市场化与监管两大主题。<b>AWS 推出 Agent 市场</b>，Anthropic 合作上线，标志着 Agent 技术商业化迈出重要一步。同时，<b>Anthropic 顶级 AI 模型遭美全面禁用</b>，凸显 AI 监管重心从硬件转向模型本身，可能重塑全球 AI 研发协作。",
    vane: [
      { label: "Agent 市场化", dir: "up", note: "AWS 推出 Agent 市场，企业可通过 AWS 直接部署、交易 Agent，Agent 技术从实验室迈入商业应用生态。" },
      { label: "AI 监管", dir: "up", note: "Anthropic 顶级 AI 模型遭美全面禁用，AI 监管重心从硬件转向模型本身，影响全球 AI 研发协作。" },
      { label: "AI 基础设施", dir: "up", note: "Meta 承诺数千亿美元投入超算集群，加速 Superintelligence Labs 部署，AI 基础设施极速扩展。" }
    ],
    items: [
      {
        region: "海外", tag: "gl",
        title: "AWS 推出 Agent 市场，Anthropic 合作上线（6.14）",
        what: "亚马逊 AWS 宣布将在纽约 Summit 发布 Agent 市场，Anthropic 为首批合作伙伴。企业可通过 AWS 直接部署、交易 Agent，标志着 Agent 技术从实验室迈入商业应用生态。",
        why: "此举意味着 AI Agent 正进入'商店经济'，未来的 AI 是可组合、可交易的服务模块，将加速 AI 技术的市场化进程和应用普及。"
      },
      {
        region: "海外", tag: "gl",
        title: "Anthropic顶级AI模型遭美全面禁用（6.14）",
        what: "美国政府以国家安全为由，对Anthropic新发布的Fable 5和Mythos 5模型实施出口管制，禁止所有非美国公民访问，系全球首次针对已商用AI模型的强制性下架行动。Anthropic为满足合规要求，被迫全面暂停两款模型对所有用户（含美国公民）的访问权限，而非仅限外籍用户，主因是无法快速精准区分国籍身份。",
        why: "此次禁令标志AI监管重心从硬件（如GPU）转向模型本身，凸显前沿AI能力被纳入高敏感技术管控范畴，或将重塑全球AI研发协作、供应链与IPO进程。"
      },
      {
        region: "海外", tag: "gl",
        title: "Meta承诺数千亿美元投入超算集群：Prometheus + Hyperion（6.14）",
        what: "Zuckerberg宣布投资数千亿美元建5GW超级智能数据中心群，加速Superintelligence Labs部署。",
        why: "AI不仅是模型体，更是'能源+硅+管理'的三位一体系统工程。Meta的大规模投资将进一步加速AI基础设施的建设，推动AI技术的快速发展和应用。"
      },
      {
        region: "中国", tag: "cn",
        title: "美团LongCat开源General 365推理评测基准（6.14）",
        what: "美团LongCat团队发布General 365开源评测基准，专注评估LLM的通用逻辑推理能力（而非领域知识）。",
        why: "该基准的发布有助于更准确地评估和提升LLM的推理能力，推动AI技术在更广泛领域的应用和发展。"
      },
      {
        region: "开源", tag: "os",
        title: "LLMhop — 面向大语言模型的微型无状态路由器开源（6.14）",
        what: "LLMhop是一个用Go编写的极简HTTP反向代理，可根据请求体中的model字段将OpenAI兼容的API请求路由到正确的推理后端。",
        why: "LLMhop的开源为开发者提供了一个轻量级、灵活的工具，以更高效地管理和部署多模型AI应用，降低运维复杂度。"
      }
    ]
  },
  {
    date: "2026-06-12", vol: "VOL.003", weekday: "周五",
    headline: "Fable 5 上线、Scout 入场：个人 Agent 的「操作系统之争」开打",
    tldr: "本周关键词是<b>收编</b>：Anthropic 把新旗舰 Fable 5 直接装进编程工具，微软把开源黑马 OpenClaw 收进 365 全家桶。当一个个人开发者的开源项目能逼微软跟进，说明个人 Agent 已从极客玩具升格为平台级入口——大厂都在抢「Agent 时代的浏览器」。",
    vane: [
      { label: "个人 Agent", dir: "up", note: "OpenClaw 37.8万星 / Scout 入场" },
      { label: "开源权重", dir: "up", note: "逼近闭源旗舰" },
      { label: "MCP 生态", dir: "up", note: "事实标准地位稳固" },
      { label: "纯聊天产品", dir: "down", note: "入口价值被 Agent 稀释" }
    ],
    items: [
      {
        region: "海外", tag: "gl",
        title: "Anthropic 发布 Claude Fable 5（6.9）",
        what: "新一代旗舰模型，主打长程任务的稳定执行与更强的编码 / Agent 能力，发布当天即在 Claude Code 全量上线。",
        why: "模型公司的发布重心已从「聊天更聪明」转向「干活更可靠」。新旗舰首发渠道是编程工具而非聊天界面——判断行业风向，看发布渠道比看跑分更准。"
      },
      {
        region: "海外", tag: "gl",
        title: "微软发布 Scout，基于开源项目 OpenClaw（6.2）",
        what: "常驻型个人 AI 助理，公开承认构建在 OpenClaw 框架之上，深度接入 Microsoft 365，具备持久身份与记忆。",
        why: "巨头第一次「反向采用」个人开发者的开源 Agent 框架。开源社区已成为 Agent 产品创新的源头而非追随者，PM 选型时 GitHub 趋势榜的权重应该调高。"
      },
      {
        region: "开源", tag: "os",
        title: "OpenClaw 突破 37.8 万星，成 GitHub 增长最快项目之一",
        what: "Peter Steinberger 的本地优先个人助理：数据不出自己的机器，可通过 WhatsApp / Telegram / Slack 等渠道指挥，连接 50+ 工具，贡献者超 1200 人。今年从 9 千星涨到 37.8 万星（本站实测数据）。",
        why: "「隐私 + 自托管」是它对抗大厂托管方案的护城河。用户要的不是更聪明的聊天框，而是一个真正属于自己的数字员工——这是个人 Agent 赛道最值得抄的产品定位作业。"
      },
      {
        region: "中国", tag: "cn",
        title: "月之暗面获约 140 亿元新融资，DeepSeek 估值约 3000 亿",
        what: "Kimi 母公司完成新一轮融资，C 端订阅年收入已达数亿元；DeepSeek 最新估值约 3000 亿元人民币。",
        why: "国内从「百模大战」收敛到五六家头部。资本现在下注的是「模型 + Agent 产品」的全栈能力，纯模型公司的估值逻辑已经失效。"
      }
    ]
  },
  {
    date: "2026-06-11", vol: "VOL.002", weekday: "周四",
    headline: "企业级 Agent 不再演示，开始上岗",
    tldr: "Workday 一口气上线<b>数百个</b> HR / 财务 Agent，TELUS 公布用 Claude Code 省下 50 万工时的实账，Google 把开源模型对准 Agent 场景。「AI 从演示走向生产」不再是 PPT 话术——采购订单已经签了。",
    vane: [
      { label: "企业 Agent", dir: "up", note: "按岗位卖、按结果计价" },
      { label: "编程 Agent ROI", dir: "up", note: "第一批大客户实账公开" },
      { label: "算力基建", dir: "up", note: "军备竞赛延伸到存储层" },
      { label: "AI 炒作叙事", dir: "down", note: "「hype is over」成媒体共识" }
    ],
    items: [
      {
        region: "海外", tag: "gl",
        title: "Workday 上线数百个企业 Agent",
        what: "覆盖 HR、财务、IT、法务，含薪酬、审计、合同谈判等专职 Agent；对话入口 Sana 全量开放。",
        why: "企业软件的竞争从「加个 AI 按钮」进入「按岗位卖 Agent」。值得 PM 研究：它如何给 Agent 划权限、定价、算 ROI——这套打法会被全行业模仿。"
      },
      {
        region: "海外", tag: "gl",
        title: "TELUS 实账：Claude Code 提速 30%、累计省 50 万小时",
        what: "加拿大电信巨头披露工程团队使用编程 Agent 的量化收益：平均每次 AI 交互节省 40 分钟。",
        why: "编程 Agent 的 ROI 第一次有了运营商体量的公开数据。这类数字会成为企业采购的对标基准，也是 AI 产品商业化材料里最硬的弹药。"
      },
      {
        region: "海外", tag: "gl",
        title: "Google 发布 DiffusionGemma 26B（6.10）与 Gemma 4 系列",
        what: "开源扩散图像模型 + 专为推理和 Agent 工作流设计的开源语言模型系列（Gemma 4 12B 于 5.23 发布）。",
        why: "Google 的「开源中杯」策略：预算有限的团队先用 Gemma 搭 Agent，业务长大自然迁移到 Gemini 付费 API——用开源做获客漏斗。"
      },
      {
        region: "中国", tag: "cn",
        title: "MiniMax 开源轻量模型 M3（6.1）",
        what: "延续 M2.5「原生为 Agent 设计」路线的轻量开源模型，主打高效部署。",
        why: "国产开源已形成 Qwen / DeepSeek / GLM / Kimi / MiniMax 五强格局，「开源 + Agent 原生」是共同答卷，差异化开始体现在工具链和生态上。"
      },
      {
        region: "生态", tag: "eco",
        title: "NVIDIA × SK 海力士签多年期存储合作",
        what: "共同开发对齐 NVIDIA AI 基础设施路线图的下一代内存，应对全球「AI 工厂」扩建的供应需求。",
        why: "算力军备竞赛延伸到了存储层，扩建周期以年计。对从业者：基建层的确定性远高于应用层，这是判断行业景气度的底层指标。"
      }
    ]
  },
  {
    date: "2026-06-10", vol: "VOL.001", weekday: "周三",
    headline: "五月模型潮复盘：1M 上下文成为旗舰标配",
    tldr: "过去三周是 2026 年最密集的发布窗口：Opus 4.8 带着 <b>1M 上下文</b>降价上场，Qwen 3.7 Max 用硬分数证明国产 Agent 能力，DeepSeek V4 Pro 把「开源逼近闭源」变成现实。模型层的性能溢价正被快速抹平，竞争重心全面转向 Agent 与工程化。",
    vane: [
      { label: "长上下文", dir: "up", note: "1M 成旗舰标配" },
      { label: "国产模型", dir: "up", note: "Agent 硬指标正面交锋" },
      { label: "推理成本", dir: "down", note: "开源模型便宜 30 倍+" },
      { label: "RAG 简单场景", dir: "down", note: "被长上下文挤压" }
    ],
    items: [
      {
        region: "海外", tag: "gl",
        title: "Claude Opus 4.8 发布（5.28）：1M 上下文",
        what: "上下文窗口扩至 100 万 token，定价 $6.25 / $25（每百万输入/输出），较上代更便宜。",
        why: "「把整个代码库塞进对话」成为常规操作。RAG 的适用边界被重新划定：简单场景直接塞上下文，RAG 退守权限控制和超大知识库。"
      },
      {
        region: "中国", tag: "cn",
        title: "Qwen 3.7 Max 发布（5.20）：SWE-Pro 60.6%",
        what: "阿里云峰会发布，SWE-Pro 60.6%、Terminal-Bench 2.0 69.7%；Plus 版 1M 上下文，价格约为海外旗舰的 1/15。",
        why: "国产第一梯队首次在 Agent 硬指标上与海外旗舰正面交锋，而且打的是价格战——这是中国队的主动权所在。"
      },
      {
        region: "开源", tag: "os",
        title: "DeepSeek V4 Pro：MIT 协议 + 降价 75%",
        what: "首个在真实编码 / 推理基准上贴近 GPT-5.5 与 Opus 4.7 的开源权重模型，输出 token 价格约为 GPT-5.5 的 1/34。",
        why: "闭源模型的护城河只剩「最前沿那半年」。对应用团队：先用开源模型把产品跑通，再为关键链路买旗舰能力，成本结构完全不同。"
      },
      {
        region: "海外", tag: "gl",
        title: "Google 双发：Gemini 3.5 Flash（5.19）+ Gemma 4 12B（5.23）",
        what: "速度型轻量旗舰与开源中杯模型相继发布。",
        why: "Google 产品矩阵已覆盖从免费原型到生产旗舰的全部价位段，按场景分层选型是 2026 年的基本功。"
      },
      {
        region: "海外", tag: "gl",
        title: "微软自研双模型：MAI-Code-1-Flash / MAI-Thinking-1（6.2）",
        what: "快速编码模型与推理模型，微软自研体系持续加码。",
        why: "在深度绑定 OpenAI 的同时加速自研备份，巨头「既合作又备胎」的格局明朗化——供应商锁定风险是每个 AI 产品都要管理的变量。"
      }
    ]
  }
];
