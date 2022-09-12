import axios, { AxiosInstance } from 'axios';
import moment from 'moment-timezone';

const DAILY_BIBLE_API_URL = 'https://sum.su.or.kr:8888/Ajax/Bible';

export const _axios: AxiosInstance = axios.create({
  baseURL: DAILY_BIBLE_API_URL,
  timeout: 10000,
});

const BIBLE_TYPE_MAPPER = {
  기본: 'QT1',
  영어: 'QT4',
  순: 'QT6',
  청소년: 'QT2',
  청소년_영어: 'QT9',
  고학년: 'QT3',
  고학년_영어: 'QT10',
  저학년: 'QT7',
  저학년_영어: 'QT5',
  큐티아이: 'QT8',
};

export type TBibleType = keyof typeof BIBLE_TYPE_MAPPER;

/* ---------------- 본문 ---------------- */

type TDailyBible = {
  Num: number; // 0
  Bible_Id: number; // 0
  Ver_Cd: number; // 1212
  Version_Name?: string; // null
  Bible_Code: number; // 49
  Bible_Name?: number; // null
  Chapter: number; // 5
  Verse: number; // 8
  Bible_Cn: string; // 여러분이 전에는 어둠이었으나, 지금은 주님 안에서 빛입니다. 빛의 자녀답게 사십시오.
};

export const getDailyBible = async ({
  bibleType = '기본',
  date = new Date(),
}: {
  bibleType?: TBibleType;
  date?: string | Date;
} = {}) => {
  const { data } = await _axios.post<TDailyBible[]>('/BodyBible', {
    qt_ty: BIBLE_TYPE_MAPPER[bibleType],
    Base_de: moment(new Date(date)).format('yyyy-MM-DD'),
  });

  return data;
};

/* ---------------- 해설 ---------------- */

type TDailyBibleContent = {
  Base_de: string; // '2022-09-12'
  Bible_chapter: string; // '5:8 - 5:14'
  Bible_name: string; // '에베소서(Ephesians)'
  Bible_song: number; //208
  Date_name?: string; // null
  New_song: number; // 289
  Page_cnt: number; // 0
  Pay_ty: string; // 'False'
  Qt_Brf: string; // '사도는 빛의 자녀가 된 성도들이 어둠에 속한 이방인의 삶을 버리고 빛의 자녀답게 빛의 열매를 맺으며 살라고 권면합니다.<br>'
  Qt_a1: string; // Bibletype 2일 경우 이미지 형태의 발행물이 온다. 'J20220912-1.jpg'
  Qt_a2: string; // '8절   그리스도인은 ‘전에는’과 ‘이제는’이 확연히 구분되는 사람입니다. 과거에는 어둠 속에 사는 어둠이었습니다. 빛보다 어둠을 더 사랑하는(요 3:19) 세상에 물들어 지각과 심령이 어두워져(4:18) ‘사망의 땅과 그늘에 앉은 자’(마 4:16)였습니다. 지금은 빛 속에 살고 있고, 빛입니다. 빛이신 하나님이(요일 1:5) 마음의 눈을 밝히셔서(4:18) 빛이신 예수님을 믿게 하셨고, 빛나는 믿음으로 살게 하셨습니다. 빛의 자녀가 받은 사명은 존재 자체로 빛인 자신을 숨기지 않고 드러내는 것입니다. 그러니 어둠이 갈수록 짙어진다고 체념하지 말고, 제자리를 지키는 우리의 작은 빛을 통해 빛이신 그리스도를 더욱 선명하게 드러냅시다. <br><br>9절   빛의 열매는 선함과 의로움과 진실함입니다. 빛의 자녀들은 어질고 관대한 행실과 올곧은 삶, 그리고 거짓 없고 진실한 말과 행실을 드러냅니다. 어둠의 세상에서 살아남기 힘든 행실이고 외면과 따돌림을 무릅써야 하기에 큰 용기와 담력이 필요한 삶입니다. <br><br>10절   성령을 근심하게 하지 않고(4:30) 주를 기쁘시게 하기 위해서는 ‘분별’(시험)이 필요합니다. 빛으로 사는 것은 초월적이고 신비한 경지가 아니라, 사사로운 일상의 모든 행동을 살피고 식별하고 검증하는 것입니다. 하나님의 선하시고 기뻐하시고 온전하신 뜻이 무엇인지 분별하기 위해(롬 12:2), 범사에 헤아려(분별하여) 좋은 것을 취하기 위해(살전 5:21), 내 필요와 느낌이 아닌 복음과 말씀을 기준으로 삼는 것입니다.<br><br>11,12절   빛의 자녀들은 어둠에 참여하지 않는 데 그치지 말고 더 적극적으로 어둠을 폭로해야 합니다. 은밀히 행해지는 부끄러운 악을 묵인하지 말고 항거하고 고발해야 합니다. 그럴수록 칭찬과 보상을 받기는커녕 더 가혹한 처벌과 보복을 당하게 되는 악한 구조 속에서 살지만, 빛인 우리 삶을 등경 위에(마 5:15) 두어야 합니다. <br><br>13,14절   이제라도 바울의 권고와 경고를 듣고 죽음의 잠에서 깨어나 새로운 신분에 걸맞은 빛의 삶을 살라고 합니다. 내게 적용하고 실천하기를 지체하지 맙시다.<br>'
  Qt_a3: string; // '공동체-주님을 기쁘시게 하는 것이 무엇인지 살펴서 그 삶을 살도록 저를 도우소서.<br>열방-미얀마 군부가 기독교인 다수 거주지역에서 자행하는 교회 파괴와 민간인을 향한 폭력을 중단하고, 신앙과 인권을 존중하며 민주적 통치를 회복할 수 있도록<br>'
  Qt_a4: string; // ''
  Qt_cd?: string; // null
  Qt_id: string; // 'QT-0000031089'
  Qt_q1: number; // 1406
  Qt_q1_str: string; // '하나님은 어떤 분입니까?'
  Qt_q2: number; // 1410
  Qt_q2_str: string; // '내게 주시는 교훈은 무엇입니까?'
  Qt_q3: number; // 1416
  Qt_q3_str: string; // '기도'
  Qt_q4: number; // 1406
  Qt_q4_str: string; // '하나님은 어떤 분입니까?'
  Qt_sj: string; // '너희는 빛이라  '
  Qt_ty: string; // 'QT1'
  Reg_dt: string; // '/Date(-62135596800000)/'
  Reg_id: string; // ''
  Speaker: string; // '김동주 목사'
};

export const getDailyBibleContent = async ({
  bibleType = '기본',
  date = new Date(),
}: {
  bibleType?: TBibleType;
  date?: string | Date;
} = {}) => {
  const { data } = await _axios.post<TDailyBibleContent>('/BodyBibleCont', {
    qt_ty: BIBLE_TYPE_MAPPER[bibleType],
    Base_de: moment(new Date(date)).format('yyyy-MM-DD'),
    Bibletype: '1',
  });

  return data;
};
