import { useState } from "react";
import {
  InputAccessoryView,
  Keyboard,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import DesignScreen from "../../components/DesignScreen";
import CheckIcon from "../../../assets/images/Check.svg";

export default function SignUpPhoneScreen({ navigation }) {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [open, setOpen] = useState(false);
  const [terms, setTerms] = useState(false);
  const [privacy, setPrivacy] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [carrier, setCarrier] = useState("SKT");
  const [carrierOpen, setCarrierOpen] = useState(false);
  const agreed = terms && privacy,
    valid = phone.trim() && code.trim() && agreed;
  const all = terms && privacy && marketing;
  const toggleAll = () => {
    const n = !all;
    setTerms(n);
    setPrivacy(n);
    setMarketing(n);
  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={s.keyboardDismiss}>
        <DesignScreen>
          <Text style={s.title}>
            본인 확인을 위해{`\n`}인증을 진행해 주세요.
          </Text>
          <Text style={[s.label, { top: 209 }]}>통신사</Text>
          <Pressable
            style={[s.carrier, carrierOpen && s.carrierOpen]}
            onPress={() => setCarrierOpen((value) => !value)}
          >
            <Text style={s.carrierText}>{carrier}</Text>
            <Text>{carrierOpen ? "⌃" : "⌄"}</Text>
          </Pressable>
          {carrierOpen ? (
            <View style={s.carrierMenu}>
              {["SKT", "KT", "LG U+"].map((option) => (
                <Pressable
                  key={option}
                  style={[
                    s.carrierOption,
                    option === carrier && s.carrierOptionOn,
                  ]}
                  onPress={() => {
                    setCarrier(option);
                    setCarrierOpen(false);
                  }}
                >
                  <Text style={s.carrierText}>{option}</Text>
                </Pressable>
              ))}
            </View>
          ) : null}
          <Text style={[s.label, { top: 303, left: 24 }]}>전화번호</Text>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            returnKeyType="next"
            onSubmitEditing={Keyboard.dismiss}
            placeholder="010-0000-0000"
            placeholderTextColor="#bababa"
            style={[s.input, { top: 334 }]}
          />
          <View style={s.codeWrap}>
            <View style={s.codeInputBox}>
              <TextInput
                value={code}
                onChangeText={(value) => {
                  setCode(value);
                  if (value.length === 6) Keyboard.dismiss();
                }}
                maxLength={6}
                keyboardType="number-pad"
                returnKeyType="done"
                onSubmitEditing={Keyboard.dismiss}
                inputAccessoryViewID={
                  Platform.OS === "ios" ? "verificationDone" : undefined
                }
                placeholder="인증번호 6자리"
                placeholderTextColor="#bababa"
                style={[
                  s.input,
                  {
                    position: "relative",
                    left: 0,
                    top: 0,
                    width: 251,
                    paddingRight: 60,
                  },
                ]}
              />
              <Text style={s.timer}>00:00</Text>
            </View>
            <Pressable
              disabled={code.trim().length !== 6}
              style={[s.codeConfirm, code.trim().length !== 6 && s.codeConfirmDisabled]}
              onPress={Keyboard.dismiss}
            >
              <Text style={s.codeConfirmText}>확인</Text>
            </Pressable>
          </View>
          <Pressable style={s.agree} onPress={() => setOpen(true)}>
            <CheckIcon width={19} height={19} opacity={agreed ? 1 : 0.35} />
            <Text style={s.agreeText}>본인 인증 서비스 약관 전체동의</Text>
          </Pressable>
          <Pressable
            disabled={!valid}
            style={[s.next, !valid && s.disabled]}
            onPress={() => navigation.navigate("SignUpAccount")}
          >
            <Text style={s.nextText}>다음</Text>
          </Pressable>
          <Modal visible={open} transparent animationType="slide">
            <Pressable style={s.dim} onPress={() => setOpen(false)} />
            <View style={s.sheet}>
              <View style={s.handle} />
              <Text style={s.sheetTitle}>약관 동의</Text>
              <Row text="전체 동의" value={all} onPress={toggleAll} />
              <View style={s.divider} />
              <Row
                text="[필수] 이용약관 동의"
                value={terms}
                onPress={() => setTerms(!terms)}
              />
              <Row
                text="[필수] 개인정보 처리방침 동의"
                value={privacy}
                onPress={() => setPrivacy(!privacy)}
              />
              <Row
                text="[선택] 마케팅 정보 수신 동의"
                value={marketing}
                onPress={() => setMarketing(!marketing)}
              />
              <Pressable style={s.confirm} onPress={() => setOpen(false)}>
                <Text style={s.nextText}>확인</Text>
              </Pressable>
            </View>
          </Modal>
        </DesignScreen>
        {Platform.OS === "ios" ? (
          <InputAccessoryView nativeID="verificationDone">
            <View style={s.keyboardAccessory}>
              <Pressable onPress={Keyboard.dismiss} style={s.keyboardDone}>
                <Text style={s.keyboardDoneText}>완료</Text>
              </Pressable>
            </View>
          </InputAccessoryView>
        ) : null}
      </View>
    </TouchableWithoutFeedback>
  );
}
function Row({ text, value, onPress }) {
  return (
    <Pressable style={s.row} onPress={onPress}>
      <CheckIcon width={19} height={19} opacity={value ? 1 : 0.35} />
      <Text style={s.rowText}>{text}</Text>
    </Pressable>
  );
}
const s = StyleSheet.create({
  keyboardDismiss: { flex: 1 },
  keyboardAccessory: {
    alignItems: "flex-end",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#d7d7d7",
    backgroundColor: "#f7f7f7",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  keyboardDone: { paddingHorizontal: 8, paddingVertical: 4 },
  keyboardDoneText: { color: "#14453a", fontSize: 16, fontWeight: "700" },
  title: {
    position: "absolute",
    left: 26,
    top: 118,
    width: 310,
    fontSize: 25,
    lineHeight: 32.5,
    fontWeight: "700",
  },
  label: {
    position: "absolute",
    left: 30,
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 35,
    color: "#4a4a4a",
  },
  carrier: {
    position: "absolute",
    left: 26,
    top: 238,
    width: 148,
    height: 44,
    borderWidth: 1,
    borderColor: "#e7e3d8",
    borderRadius: 15,
    backgroundColor: "#fefefe",
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  carrierOpen: { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 },
  carrierText: { fontSize: 12, color: "#9c9c9c" },
  carrierMenu: {
    position: "absolute",
    left: 26,
    top: 282,
    width: 148,
    zIndex: 20,
    borderTopWidth: 0,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    borderWidth: 1,
    borderColor: "#e7e3d8",
    backgroundColor: "#fff",
    overflow: "hidden",
    elevation: 5,
  },
  carrierOption: {
    height: 40,
    paddingHorizontal: 12,
    justifyContent: "center",
  },
  carrierOptionOn: { backgroundColor: "#eaf4ec" },
  input: {
    position: "absolute",
    left: 26,
    width: 343,
    height: 44,
    borderWidth: 1,
    borderColor: "#e7e3d8",
    borderRadius: 15,
    backgroundColor: "#fefefe",
    paddingHorizontal: 16,
    fontSize: 15,
    fontWeight: "600",
  },
  codeWrap: {
    position: "absolute",
    left: 26,
    top: 382,
    width: 343,
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  codeInputBox: { width: 251, height: 44 },
  codeConfirm: {
    width: 84,
    height: 44,
    borderRadius: 15,
    backgroundColor: "#14453a",
    alignItems: "center",
    justifyContent: "center",
  },
  codeConfirmDisabled: { backgroundColor: "#bababa" },
  codeConfirmText: { fontSize: 14, fontWeight: "700", color: "#fff" },
  timer: {
    position: "absolute",
    right: 16,
    top: 13,
    fontSize: 12,
    color: "#bababa",
  },
  agree: {
    position: "absolute",
    left: 28,
    top: 429,
    height: 26,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  check: {
    width: 19,
    height: 19,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#bababa",
    alignItems: "center",
    justifyContent: "center",
  },
  checked: { backgroundColor: "#14453a", borderColor: "#14453a" },
  tick: { fontSize: 12, color: "#fff", fontWeight: "700" },
  agreeText: { fontSize: 13, fontWeight: "500" },
  next: {
    position: "absolute",
    left: 31,
    bottom: 52,
    width: 338,
    height: 50,
    borderRadius: 20,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  disabled: { backgroundColor: "#bababa" },
  nextText: { color: "#f2f2f6", fontSize: 18, fontWeight: "700" },
  dim: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,.4)" },
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 34,
  },
  handle: {
    alignSelf: "center",
    width: 42,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#d9d9d9",
    marginBottom: 20,
  },
  sheetTitle: { fontSize: 22, fontWeight: "700", marginBottom: 18 },
  row: { height: 46, flexDirection: "row", alignItems: "center", gap: 10 },
  rowText: { fontSize: 14, fontWeight: "600" },
  divider: { height: 1, backgroundColor: "#e7e3d8", marginVertical: 4 },
  confirm: {
    height: 50,
    borderRadius: 20,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 18,
  },
});
