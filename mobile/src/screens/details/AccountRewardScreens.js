import { useState } from "react";
import {
  Image,
  Linking,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Svg, { Line, Path, Rect } from "react-native-svg";
import RewardIcon from "../../../assets/images/RewardIcon.svg";
import TrialIcon from "../../../assets/images/TrialIcon.svg";
import DiscountIcon from "../../../assets/images/DiscountIcon.svg";
import ShippingIcon from "../../../assets/images/ShippingIcon.svg";
import { useAppState } from "../../state/AppState";
import SleepTimeDial from "../../components/SleepTimeDial";
import AnimatedEntrance from "../../components/AnimatedEntrance";
import { COACH_IMAGES } from "../../utils/coach";
import { colors } from "../../theme";
function Header({ navigation, title }) {
  return (
    <View style={s.header}>
      <Pressable style={s.back} onPress={() => navigation.goBack()}>
        <Text style={s.backText}>‹</Text>
      </Pressable>
      <Text style={s.headerTitle}>{title}</Text>
    </View>
  );
}
function Button({ children, onPress, danger = false }) {
  return (
    <Pressable style={[s.button, danger && s.dangerButton]} onPress={onPress}>
      <Text style={[s.buttonText, danger && { color: colors.heart }]}>
        {children}
      </Text>
    </Pressable>
  );
}
// 교환은 백엔드에 catalogue도 redemption도 없다. 예전에는 여기서 AsyncStorage의
// 포인트를 직접 깎고 "구매가 완료됐어요"를 띄웠는데, 서버에는 아무 일도 일어나지
// 않으므로 앱을 지우면 사라지는 잔액과 존재하지 않는 쿠폰을 보여주는 셈이었다.
// 실제 교환 API가 생기기 전까지는 상품만 보여주고 아무것도 차감하지 않는다.
export function RewardDetailScreen({ navigation, route }) {
  const reward = route.params?.reward || {
    id: "serum-trial",
    title: "AAC 시그니처 세럼\n체험권",
    cost: 1500,
    note: "교환 후 30일 이내 사용",
  };
  const DetailIcon =
    reward.id === "discount-15"
      ? DiscountIcon
      : reward.id === "free-shipping"
        ? ShippingIcon
        : TrialIcon;
  return (
    <View style={s.screen}>
      <Header navigation={navigation} title="리워드 상세" />
      <ScrollView contentContainerStyle={s.content}>
        <View style={s.rewardCard}>
          <View style={s.rewardImage}>
            <DetailIcon width={44} height={44} />
          </View>
          <Text style={s.rewardTitle}>{reward.title}</Text>
          <Text style={s.sub}>{reward.note}</Text>
          <View style={s.pointRow}>
            <RewardIcon width={19} height={19} />
            <Text style={s.rewardCost}>{reward.cost}</Text>
          </View>
        </View>
        <View style={s.balanceCard}>
          <Row label="교환" value="혜택 준비 중" />
        </View>
      </ScrollView>
      <View style={s.footer}>
        <Pressable disabled style={[s.button, { backgroundColor: colors.disabled }]}>
          <Text style={s.buttonText}>혜택 준비 중</Text>
        </Pressable>
      </View>
    </View>
  );
}
function Row({ label, value, danger }) {
  return (
    <View style={s.between}>
      <Text style={s.rowLabel}>{label}</Text>
      <Text style={[s.rowValue, danger && { color: colors.heart }]}>{value}</Text>
    </View>
  );
}
const genders = ["여성", "남성", "선택 안함"],
  exercise = ["주 1회", "주 2회", "주 3회", "주 4회", "주 5회", "거의 안함"],
  meals = ["먹지 않음", "1회", "2회", "3회 이상"],
  periods = ["7일", "14일", "30일"],
  coaches = [
    ["응원형", COACH_IMAGES["응원형"]],
    ["압박형", COACH_IMAGES["압박형"]],
    ["팩트형", COACH_IMAGES["팩트형"]],
    ["유머형", COACH_IMAGES["유머형"]],
  ];
export function EditProfileScreen({ navigation }) {
  const {
    nickname: savedNickname,
    birth: savedBirth,
    coachStyle: savedCoachStyle,
    lifestyle,
    setNickname,
    setBirth,
    setCoachStyle,
    setLifestyle,
  } = useAppState();
  const [nick, setNick] = useState(savedNickname),
    [birth, setBirthValue] = useState(savedBirth),
    [dateOpen, setDateOpen] = useState(false),
    [saveDone, setSaveDone] = useState(false),
    [gender, setGender] = useState("여성"),
    [coach, setCoach] = useState(savedCoachStyle),
    [sleep, setSleep] = useState(lifestyle.sleep),
    [ex, setEx] = useState(lifestyle.exercise),
    [meal, setMeal] = useState(lifestyle.meal),
    [period, setPeriod] = useState(lifestyle.period);
  return (
    <View style={s.screen}>
      <Header navigation={navigation} title="프로필 편집" />
      <ScrollView contentContainerStyle={[s.content, s.editContent]}>
        <View style={s.profileEdit}>
          <View style={s.avatar}>
            <Text style={s.avatarText}>A</Text>
          </View>
          <Text style={s.change}>프로필 사진 바꾸기</Text>
        </View>
        <View style={s.nick}>
          <Text style={s.sub}>닉네임</Text>
          <TextInput value={nick} onChangeText={setNick} style={s.nickInput} />
          <Text>✎</Text>
        </View>
        <Field title="성별">
          <Chips list={genders} value={gender} set={setGender} />
        </Field>
        <Field title="생년월일">
          <View style={s.birthField}>
            {Platform.OS === "web" ? (
              <TextInput
                value={birth}
                onChangeText={setBirthValue}
                placeholder="YYYY-MM-DD"
                style={s.birthInput}
              />
            ) : (
              <Pressable style={s.birthValue} onPress={() => setDateOpen(true)}>
                <Text style={s.birthText}>{birth || "YYYY-MM-DD"}</Text>
              </Pressable>
            )}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="생년월일 달력 열기"
              hitSlop={8}
              style={s.calendarButton}
              onPress={() => setDateOpen(true)}
            >
              <CalendarIcon />
            </Pressable>
          </View>
          {dateOpen && Platform.OS !== "web" ? (
            <DateTimePicker
              value={
                birth ? new Date(`${birth}T00:00:00`) : new Date(2000, 0, 1)
              }
              mode="date"
              display={Platform.OS === "ios" ? "inline" : "calendar"}
              maximumDate={new Date()}
              onChange={(event, selectedDate) => {
                setDateOpen(false);
                if (event.type === "set" && selectedDate) {
                  const year = selectedDate.getFullYear();
                  const month = String(selectedDate.getMonth() + 1).padStart(
                    2,
                    "0",
                  );
                  const day = String(selectedDate.getDate()).padStart(2, "0");
                  setBirthValue(`${year}-${month}-${day}`);
                }
              }}
            />
          ) : null}
        </Field>
        <View style={s.two}>
          <Field title="키" style={s.half}>
            <UnitInput value="165" unit="cm" />
          </Field>
          <Field title="몸무게" style={s.half}>
            <UnitInput value="50" unit="kg" />
          </Field>
        </View>
        <Field title="AI 코칭">
          <View style={s.coaches}>
            {coaches.map(([name, image]) => (
              <Pressable
                key={name}
                onPress={() => setCoach(name)}
                style={[s.coach, coach === name && s.active]}
              >
                <Image
                  source={image}
                  style={{ width: 44, height: 44 }}
                  resizeMode="contain"
                />
                <Text style={s.chipText}>{name}</Text>
              </Pressable>
            ))}
          </View>
        </Field>
        <View style={s.line} />
        <Text style={s.centerTitle}>수면 시간</Text>
        <View style={s.sleep}>
          <Text style={s.sleepNumber}>{Math.floor(sleep)}</Text>
          <Text style={[s.sleepUnit, s.sleepHourUnit]}>시간</Text>
          <Text style={s.sleepNumber}>{sleep % 1 ? "30" : "00"}</Text>
          <Text style={s.sleepUnit}>분</Text>
          <View style={s.sleepDial}>
            <SleepTimeDial value={sleep} onChange={setSleep} />
          </View>
        </View>
        <View style={s.line} />
        <Field title="운동 빈도" centered>
          <Chips list={exercise} value={ex} set={setEx} columns={3} />
        </Field>
        <View style={s.line} />
        <Field title="식사 빈도" centered>
          <Chips list={meals} value={meal} set={setMeal} columns={2} />
        </Field>
        <View style={s.line} />
        <Field title="선호 기간" centered>
          <Chips list={periods} value={period} set={setPeriod} columns={3} />
        </Field>
        <Button
          onPress={() => {
            setNickname(nick);
            setBirth(birth);
            setCoachStyle(coach);
            setLifestyle({ sleep, exercise: ex, meal, period });
            setSaveDone(true);
          }}
        >
          저장하기
        </Button>
      </ScrollView>
      <Modal
        visible={saveDone}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => {
          setSaveDone(false);
          navigation.goBack();
        }}
      >
        <View style={s.dim}>
          <AnimatedEntrance distance={12} duration={280} style={s.profileSaved}>
            <AnimatedEntrance delay={90} distance={8} duration={320}>
              <View style={s.successHalo}>
                <View style={s.check}>
                  <Text style={s.checkText}>✓</Text>
                </View>
              </View>
            </AnimatedEntrance>
            <Text style={s.savedTitle}>프로필을 저장했어요!</Text>
            <Text style={s.savedSub}>
              변경한 정보가 모든 화면에 바로 반영됐어요.
            </Text>
            <Pressable
              style={s.savedButton}
              onPress={() => {
                setSaveDone(false);
                navigation.goBack();
              }}
            >
              <Text style={s.savedButtonText}>확인</Text>
            </Pressable>
          </AnimatedEntrance>
        </View>
      </Modal>
    </View>
  );
}
function Field({ title, children, centered, style }) {
  return (
    <View style={[s.field, style]}>
      <Text style={[s.fieldTitle, centered && { textAlign: "center" }]}>
        {title}
      </Text>
      {children}
    </View>
  );
}
function CalendarIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 20 20">
      <Rect
        x={2}
        y={3.5}
        width={16}
        height={14.5}
        rx={3}
        fill="none"
        stroke={colors.primary}
        strokeWidth={1.7}
      />
      <Line x1={2} y1={8} x2={18} y2={8} stroke={colors.primary} strokeWidth={1.7} />
      <Path
        d="M6 2 L6 5 M14 2 L14 5"
        stroke={colors.primary}
        strokeWidth={1.7}
        strokeLinecap="round"
      />
    </Svg>
  );
}
function Chips({ list, value, set, columns }) {
  return (
    <View style={[s.chips, columns && s.chipGrid]}>
      {list.map((x) => (
        <Pressable
          key={x}
          style={[
            s.chip,
            columns ? s.gridChip : s.flexChip,
            columns === 2 && s.twoColumnChip,
            columns === 3 && s.threeColumnChip,
            value === x && s.active,
          ]}
          onPress={() => set(x)}
        >
          <Text style={s.chipText}>{x}</Text>
        </Pressable>
      ))}
    </View>
  );
}
function SmallInput({ value, suffix }) {
  return (
    <View style={s.smallWrap}>
      <TextInput
        defaultValue={value}
        keyboardType="number-pad"
        style={s.smallInput}
      />
      <Text>{suffix}</Text>
    </View>
  );
}
function UnitInput({ value, unit }) {
  return (
    <View style={s.unitWrap}>
      <TextInput
        defaultValue={value}
        keyboardType="number-pad"
        style={s.unitInput}
      />
      <Text style={s.unit}>{unit}</Text>
    </View>
  );
}
const settings = [
  ["routine", "루틴 인증 알림", "마감 임박, 인증 리마인드", true],
  ["group", "그룹 활동 알림", "응원, 댓글, 새 멤버 참가", true],
  ["goal", "공동 목표 달성 알림", "그룹 공동 목표 달성 시 알림", true],
  ["reward", "리워드 · 이벤트 알림", "하트 이벤트, 신규 리워드 소식", true],
  ["marketing", "마케팅 알림", "AAC 혜택 및 프로모션 소식", false],
];
export function NotificationsScreen({ navigation }) {
  const [values, setValues] = useState(
    Object.fromEntries(settings.map((x) => [x[0], x[3]])),
  );
  return (
    <ListScreen navigation={navigation} title="알림 설정">
      <View style={s.listCard}>
        {settings.map(([key, label, desc], i) => (
          <View key={key} style={[s.setting, i && s.topLine]}>
            <View style={{ flex: 1 }}>
              <Text style={s.settingTitle}>{label}</Text>
              <Text style={s.settingDesc}>{desc}</Text>
            </View>
            <Switch
              value={values[key]}
              onValueChange={(v) => setValues((x) => ({ ...x, [key]: v }))}
              trackColor={{ false: "#d9d9d9", true: colors.primary }}
            />
          </View>
        ))}
      </View>
      <Text style={s.notice}>
        루틴 인증 알림을 꺼두면 마감 임박 리마인드를 받지 못해 완주율에 영향을
        줄 수 있어요.
      </Text>
    </ListScreen>
  );
}
const minimum = [
  ["프로필", "닉네임, 선택 이미지 등 최소 정보 중심으로만 저장해요."],
  ["온보딩 정보", "루틴방 추천에 필요한 기본 생활 패턴·습관·기간만 수집해요."],
  ["인증 콘텐츠", "루틴 수행 확인에 필요한 범위만 촬영하도록 안내해요."],
  ["그룹 피드", "내가 속한 방의 구성원만 내 인증 기록을 볼 수 있어요."],
  ["보관 정책", "수집 목적과 보관 기간을 명시하고, 삭제·탈퇴 요청을 지원해요."],
];
export function PrivacyScreen({ navigation }) {
  const [profile, setProfile] = useState(true),
    [rank, setRank] = useState(true);
  return (
    <ListScreen navigation={navigation} title="개인정보 보호">
      <Text style={s.sectionLabel}>공개 범위</Text>
      <View style={s.listCard}>
        <ToggleRow
          title="프로필 공개"
          desc="다른 사용자가 내 닉네임과 참여 기록을 볼 수 있어요."
          value={profile}
          set={setProfile}
        />
        <ToggleRow
          title="개인 순위 공개"
          desc="같은 방 구성원에게 내 순위와 달성률을 보여줘요."
          value={rank}
          set={setRank}
          line
        />
      </View>
      <Text style={s.sectionLabel}>개인정보 최소화 원칙</Text>
      <View style={s.listCard}>
        {minimum.map(([title, desc], i) => (
          <View key={title} style={[s.textRow, i && s.topLine]}>
            <Text style={s.settingTitle}>{title}</Text>
            <Text style={s.settingDesc}>{desc}</Text>
          </View>
        ))}
      </View>
      <Button>내 데이터 다운로드 요청</Button>
      <Button danger>계정 삭제 요청</Button>
    </ListScreen>
  );
}
function ToggleRow({ title, desc, value, set, line }) {
  return (
    <View style={[s.setting, line && s.topLine]}>
      <View style={{ flex: 1 }}>
        <Text style={s.settingTitle}>{title}</Text>
        <Text style={s.settingDesc}>{desc}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={set}
        trackColor={{ false: "#d9d9d9", true: colors.primary }}
      />
    </View>
  );
}
const terms = [
  [
    "제1조 (목적)",
    "이 약관은 ALLOG(Anti-Lazing Log)가 제공하는 그룹형 루틴 수행 서비스의 이용 조건과 절차, 회원과 서비스의 권리·의무를 규정합니다.",
  ],
  [
    "제2조 (루틴방 이용)",
    "회원은 공개 루틴방에 직접 참가하거나, 친구끼리 참여를 체크해 비공개 루틴방을 만들고 초대링크로 팀원을 초대할 수 있습니다. 모든 루틴방은 방장이 설정한 정원이 충족되면 루틴 수행이 시작됩니다.",
  ],
  [
    "제3조 (하트 시스템)",
    "회원은 온보딩 완료 시 하트 3개를 지급받으며, 루틴방 1개 참여당 하트 1개를 사용합니다. 개인 루틴 달성률 70% 이상이고 부정 인증 이력이 없는 경우 하트 1개가 반환됩니다. 미완주 시 사용한 하트는 반환되지 않습니다.",
  ],
  [
    "제4조 (인증 및 평가)",
    "회원은 사진·동영상·앱 기록 등 루틴 특성에 맞는 방식으로 인증합니다. AI는 관련성, 제출 시간, 중복 이미지, 이상 징후를 1차 검토하며, 최종 진위 판정과 제재는 AI가 단독으로 결정하지 않습니다.",
  ],
  [
    "제5조 (금지행위 및 제재)",
    [
      "이전 인증물 재사용 또는 타인 콘텐츠 도용 — 해당 인증 무효, 점수 재산정, 반복 시 참여 제한",
      "루틴과 무관하거나 수행 확인이 어려운 인증 — 추가 검토 후 인증 무효 또는 재인증 요청",
      "부적절한 콘텐츠·커뮤니티 규칙 위반 — 콘텐츠 삭제, 경고, 방 퇴장, 이후 참여 제한",
      "보상 지급 후 부정 확인 — 하트·포인트·쿠폰·체험 혜택 취소 또는 회수",
      "악의적 허위 신고 — 신고자 경고, 신고 기능 또는 활동 제한",
    ],
  ],
  [
    "제6조 (그룹 피드와 개인정보)",
    "공개방과 친구방 모두 인증 피드는 해당 방 구성원만 확인할 수 있습니다. 회원의 개인정보는 닉네임, 선택 이미지 등 최소 정보 중심으로 수집하며, 삭제·탈퇴 요청 시 관련 절차를 지원합니다.",
  ],
  [
    "제7조 (의료·건강 정보에 대한 면책)",
    "ALLOG와 AI 코치는 의료적 진단이나 치료 결정을 내리지 않습니다. 운동·식단·수면 등 루틴 관련 안내는 참고용이며, 의료 전문가의 진단과 상담을 대체하지 않습니다.",
  ],
  [
    "제8조 (약관의 변경)",
    "서비스는 운영상 필요한 경우 관련 법령을 준수하여 이 약관을 개정할 수 있으며, 개정 시 서비스 내 공지사항을 통해 사전 안내합니다.",
  ],
];
export function TermsScreen({ navigation }) {
  return (
    <ListScreen navigation={navigation} title="이용약관">
      <Text style={s.notice}>시행일: 2026.08.10</Text>
      <View style={[s.listCard, { padding: 20, gap: 18 }]}>
        {terms.map(([t, b]) => (
          <View key={t}>
            <Text style={s.settingTitle}>{t}</Text>
            {Array.isArray(b) ? (
              b.map((line) => (
                <Text
                  key={line}
                  style={[
                    s.settingDesc,
                    { fontSize: 11, lineHeight: 18, marginTop: 5 },
                  ]}
                >
                  • {line}
                </Text>
              ))
            ) : (
              <Text
                style={[
                  s.settingDesc,
                  { fontSize: 12, lineHeight: 20, marginTop: 6 },
                ]}
              >
                {b}
              </Text>
            )}
          </View>
        ))}
      </View>
    </ListScreen>
  );
}
const faqs = [
  [
    "하트는 어떻게 다시 얻나요?",
    "출석, AAC SNS 팔로우, 웰니스 콘텐츠 확인, 친구 초대, 제휴 QR, 캠페인 참여 등 하트 이벤트 화면에서 다시 얻을 수 있어요.",
  ],
  [
    "루틴 인증은 어떻게 검토되나요?",
    "AI가 관련성, 제출 시간, 중복 이미지, 이상 징후를 1차로 검토해요.",
  ],
  [
    "완주하지 못하면 하트는 어떻게 되나요?",
    "개인 달성률 70% 이상이고 부정 인증 이력이 없어야 하트 1개가 반환돼요.",
  ],
  [
    "친구끼리만 참여하는 방은 어떻게 만드나요?",
    "그룹 만들기에서 비공개를 선택하고 초대 코드를 공유하세요.",
  ],
  [
    "부적절한 인증이나 콘텐츠는 어떻게 신고하나요?",
    "그룹 피드의 신고 기능을 이용할 수 있어요.",
  ],
];
export function SupportScreen({ navigation }) {
  const [open, setOpen] = useState(0);
  return (
    <ListScreen navigation={navigation} title="고객센터">
      <View style={[s.listCard, { padding: 20 }]}>
        <Text style={s.settingTitle}>1:1 문의하기</Text>
        <Text style={s.settingDesc}>
          평일 10:00 ~ 18:00 (주말·공휴일 휴무){`\n`}보통 영업일 기준 1~2일 이내
          답변드려요.
        </Text>
        <Pressable
          style={[s.button, { marginTop: 12 }]}
          onPress={() => Linking.openURL("mailto:support@allog.app")}
        >
          <Text style={s.buttonText}>support@allog.app 로 문의하기</Text>
        </Pressable>
      </View>
      <Text style={s.sectionLabel}>자주 묻는 질문</Text>
      <View style={s.listCard}>
        {faqs.map(([q, a], i) => (
          <Pressable
            key={q}
            style={[s.faq, i && s.topLine]}
            onPress={() => setOpen(open === i ? -1 : i)}
          >
            <View style={s.between}>
              <Text style={s.faqQ}>{q}</Text>
              <Text>⌄</Text>
            </View>
            {open === i && <Text style={s.faqA}>{a}</Text>}
          </Pressable>
        ))}
      </View>
    </ListScreen>
  );
}
export function SettingsScreen({ navigation }) {
  return (
    <View style={s.center}>
      <Text style={s.headerTitle}>설정 화면{`\n`}(준비 중이에요)</Text>
      <Button onPress={() => navigation.goBack()}>마이페이지로 돌아가기</Button>
    </View>
  );
}
function ListScreen({ navigation, title, children }) {
  return (
    <View style={s.screen}>
      <Header navigation={navigation} title={title} />
      <ScrollView contentContainerStyle={s.content}>{children}</ScrollView>
    </View>
  );
}
const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  header: {
    height: 67,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  back: {
    width: 43,
    height: 43,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  backText: { fontSize: 30, lineHeight: 32 },
  headerTitle: { fontSize: 19, fontWeight: "700" },
  content: { paddingHorizontal: 20, paddingBottom: 35, gap: 16 },
  editContent: { paddingBottom: 40, gap: 24 },
  footer: { paddingHorizontal: 20, paddingBottom: 28 },
  button: {
    height: 50,
    borderRadius: 27.5,
    backgroundColor: colors.black,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: { fontSize: 15, fontWeight: "700", color: colors.white },
  dangerButton: {
    borderWidth: 1,
    borderColor: colors.heart,
    backgroundColor: colors.white,
  },
  rewardCard: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
    padding: 24,
    alignItems: "center",
  },
  rewardImage: {
    width: 88,
    height: 88,
    borderRadius: 20,
    backgroundColor: "#f3efe4",
    alignItems: "center",
    justifyContent: "center",
  },
  rewardEmoji: { fontSize: 42 },
  rewardTitle: {
    marginTop: 16,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700",
  },
  sub: { marginTop: 6, fontSize: 12, color: colors.muted },
  pointRow: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  rewardCost: { fontSize: 24, fontWeight: "700" },
  balanceCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
    padding: 20,
    gap: 12,
  },
  between: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowLabel: { fontSize: 13, fontWeight: "600", color: colors.muted },
  rowValue: { fontSize: 15, fontWeight: "700" },
  line: { height: 1, backgroundColor: colors.line },
  dim: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,.4)",
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  purchase: {
    width: "100%",
    maxWidth: 340,
    borderRadius: 28,
    backgroundColor: colors.bg,
    padding: 26,
    alignItems: "center",
  },
  successHalo: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: "#e5f4e8",
    alignItems: "center",
    justifyContent: "center",
  },
  check: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  checkText: { fontSize: 26, fontWeight: "700", color: colors.white },
  successBadge: {
    marginTop: 14,
    borderRadius: 99,
    backgroundColor: "#f0e2b8",
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  successBadgeText: { fontSize: 11, fontWeight: "700", color: "#6c5315" },
  purchaseTitle: { marginTop: 10, fontSize: 21, fontWeight: "800" },
  purchaseSub: {
    marginTop: 7,
    textAlign: "center",
    fontSize: 12,
    lineHeight: 18,
    color: colors.muted,
  },
  purchasedItem: {
    marginTop: 20,
    width: "100%",
    minHeight: 86,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  purchasedIcon: {
    width: 54,
    height: 54,
    borderRadius: 16,
    backgroundColor: "#f3efe4",
    alignItems: "center",
    justifyContent: "center",
  },
  purchasedCopy: { flex: 1 },
  purchaseName: {
    fontSize: 13,
    fontWeight: "700",
  },
  purchaseNote: { marginTop: 4, fontSize: 10, color: colors.muted },
  purchaseCostRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  purchaseCost: { fontSize: 13, fontWeight: "800" },
  remain: {
    marginTop: 12,
    marginBottom: 18,
    width: "100%",
    borderRadius: 15,
    backgroundColor: colors.primaryPale,
    paddingHorizontal: 16,
    paddingVertical: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  remainLabel: { fontSize: 12, fontWeight: "600", color: "#496157" },
  remainValue: { fontSize: 17, fontWeight: "800", color: colors.primary },
  purchaseAction: { width: "100%" },
  profileSaved: {
    width: "100%",
    maxWidth: 330,
    borderRadius: 28,
    backgroundColor: colors.bg,
    paddingHorizontal: 26,
    paddingTop: 30,
    paddingBottom: 22,
    alignItems: "center",
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 12,
  },
  savedTitle: { marginTop: 18, fontSize: 21, fontWeight: "800" },
  savedSub: {
    marginTop: 8,
    textAlign: "center",
    fontSize: 13,
    lineHeight: 19,
    color: colors.muted,
  },
  savedButton: {
    marginTop: 24,
    width: "100%",
    height: 50,
    borderRadius: 17,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  savedButtonText: { fontSize: 15, fontWeight: "800", color: colors.white },
  profileEdit: { alignItems: "center" },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.black,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: 22, fontWeight: "700", color: colors.white },
  change: { marginTop: 10, fontSize: 12, fontWeight: "600", color: colors.muted },
  nick: {
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  nickInput: { flex: 1, textAlign: "center", fontSize: 15, fontWeight: "600" },
  field: { gap: 8 },
  half: { flex: 1 },
  fieldTitle: { fontSize: 13, fontWeight: "700", color: colors.subtle },
  chips: { flexDirection: "row", gap: 8 },
  chipGrid: { flexWrap: "wrap", gap: 12 },
  chip: {
    minHeight: 42,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  flexChip: { flex: 1 },
  gridChip: { height: 54, paddingHorizontal: 8 },
  twoColumnChip: { width: "48%" },
  threeColumnChip: { width: "30.8%" },
  active: {
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: colors.primaryPale,
  },
  chipText: { fontSize: 12, fontWeight: "600" },
  date: { flexDirection: "row", gap: 8 },
  birthField: {
    height: 48,
    borderWidth: 1,
    borderColor: "#d9d9d9",
    backgroundColor: colors.white,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  birthInput: { flex: 1, height: "100%", paddingHorizontal: 14, fontSize: 13 },
  birthValue: {
    flex: 1,
    height: "100%",
    paddingHorizontal: 14,
    justifyContent: "center",
  },
  birthText: { fontSize: 13, color: colors.ink },
  calendarButton: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  smallWrap: { flexDirection: "row", alignItems: "center", gap: 5 },
  smallInput: {
    width: 64,
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
    textAlign: "center",
  },
  two: { flexDirection: "row", gap: 12 },
  unitWrap: {
    height: 48,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  unitInput: {
    flex: 1,
    minWidth: 0,
    height: "100%",
    paddingLeft: 34,
    paddingRight: 34,
    textAlign: "center",
  },
  unit: { position: "absolute", right: 12, color: colors.disabled },
  coaches: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  coach: {
    width: "48%",
    height: 82,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  centerTitle: { textAlign: "center", fontSize: 15, fontWeight: "700" },
  sleep: {
    height: 191,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "center",
    gap: 6,
    paddingTop: 24,
  },
  sleepNumber: { fontSize: 33, fontWeight: "700" },
  sleepUnit: { marginTop: 18, fontSize: 13, color: "#696973" },
  sleepHourUnit: { marginRight: 10 },
  sleepDial: {
    position: "absolute",
    left: 1,
    right: 1,
    bottom: 18,
    height: 92,
  },
  listCard: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
    overflow: "hidden",
  },
  setting: {
    minHeight: 76,
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  topLine: { borderTopWidth: 1, borderColor: colors.line },
  settingTitle: { fontSize: 14, fontWeight: "700" },
  settingDesc: { marginTop: 4, fontSize: 11, lineHeight: 17, color: colors.muted },
  notice: {
    paddingHorizontal: 4,
    fontSize: 11,
    lineHeight: 18,
    color: colors.muted,
  },
  sectionLabel: { fontSize: 13, fontWeight: "700", color: colors.subtle },
  textRow: { paddingHorizontal: 20, paddingVertical: 16 },
  faq: { padding: 18 },
  faqQ: { flex: 1, fontSize: 13, fontWeight: "700" },
  faqA: { marginTop: 12, fontSize: 12, lineHeight: 19, color: colors.muted },
  center: {
    flex: 1,
    backgroundColor: colors.bg,
    padding: 32,
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
  },
});
