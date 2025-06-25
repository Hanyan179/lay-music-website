export interface IdentityTag {
  title: string
  description: string
}

// 艺术家生平介绍
export const artistBiography = `1991年  出生于湖南长沙。

2005年  参加《明星学院》获季军，正式踏入演艺圈。

2008年  通过SM全球选拔成为练习生赴韩训练。

2012年  以EXO-M主舞身份出道，迅速崛起于中韩偶像圈。

2015-2016年  客串影视作品包括《好先生》《老九门》，并主演电影《前任2》《从天儿降》，凭《前任2》获中英电影节最佳男配角。

2015-2018年  加入《极限挑战》"极限男人帮"，展现亲和公益形象。

2016-2018年  开启Solo音乐生涯，《Lose Control》《NAMANANA》侵占榜单。

2018-2021年  担任《偶像练习生》《青春有你》《我是唱作人》导师；《这就是街舞》街舞队长。

2020年  成立染色体娱乐集团出任CEO。

2021年  出演话剧《受到召唤·敦煌》并获敦煌文化大使身份；同年主演电视剧《扫黑风暴》。

2022-2025年  担任湖南共青团、中国网络诚信、文旅等宣传大使，代言国际品牌，持续影响文化与社会。

2023-2024年  主演电影《孤注一掷》《长沙夜生活》《传说》《不说话的爱》，角色多元，备受赞誉。`

const identityTags: IdentityTag[] = [
  { title: 'EXO 主舞', description: '2012年以 EXO-M 成员出道，凭借精湛舞技奠定偶像地位。' },
  { title: 'Solo 艺人', description: '2016年推出首张个人专辑《Lose Control》，横扫华语榜单；2018年凭《NAMANANA》登上 Billboard 200，成为首位入榜的华人男歌手。' },
  { title: '综艺导师', description: '《偶像练习生》《青春有你》《我是唱作人》等热门节目担任导师/制作人，推动偶像产业发展。' },
  { title: '街舞队长', description: '《这就是街舞》第三、四季担任队长，获中国街舞运动推广大使称号，助推街舞文化出圈。' },
  { title: '企业创始人', description: '2020年创立"染色体娱乐集团"，主理艺人管理、内容制作与偶像孵化，晋身娱乐企业家。' },
  { title: '宣传大使', description: '担任湖南共青团宣传大使、中国网络诚信宣传大使等多个公益与城市推广角色。' },
  { title: '全球品牌代言人', description: 'Calvin Klein、Valentino、MAC、Hublot 等多个国际时尚及消费品牌代言人。' },
  { title: '舞台制作人 / 作曲人', description: '拥有《Honey》《莲》《玉》《Veil》等代表作，亲自作词作曲编舞，具备完整舞台构建能力。' },
  { title: '国际巡演艺人', description: '举办"Grandline"世界巡演，覆盖亚洲、美洲、欧洲主要城市，输出华人流行文化。' },
  { title: '文化代表人物', description: '荣获"全国向上向善好青年"等称号，参与主旋律文艺与国家级项目演出。' }
]

export default identityTags; 