/* AI Trends — 行业日报数据（最新在前）
   每日更新方法见 README.md：让 Claude Code 调研后重写本文件即可 */
window.AIT_REPORTS = [
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
