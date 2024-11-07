import Button from "@/src/components/buttons/Button";
import Header from "@/src/components/navigation/Header";
import HeaderButton from "@/src/components/navigation/HeaderButton";
import { ThemedText } from "@/src/components/ThemedText";
import {
  BackgroundColor,
  BrandColor,
  NeutralColor,
  TextColor,
} from "@/src/constants/Colors";
import { useLogoutMutation } from "@/src/features/auth/auth.service";
import { clearAuth } from "@/src/features/auth/authSlice";
import { useGetProfileQuery } from "@/src/features/user/user.service";
import { useAppDispatch, useAppSelector } from "@/src/hooks/hooks";
import { useLocale } from "@/src/hooks/useLocale";
import { TextType } from "@/src/types/text";
import Entypo from "@expo/vector-icons/Entypo";
import { Href, Link, Stack, useRouter } from "expo-router";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ChevronRight, ChevronsRight, LogOut } from "react-native-feather";

const Page = () => {
  const router = useRouter();
  const { t } = useLocale();
  const dispatch = useAppDispatch();
  const { user, tokens, walletId, isAuthenticated } = useAppSelector(
    (state) => state.auth
  );
  const [logout, { data, isSuccess, isError, error, isLoading }] =
    useLogoutMutation();
  const { data: userInfo, isError: isErrorGetInfo } = useGetProfileQuery();

  const handleLogout = async () => {
    await logout();
  };
  return (
    <View style={styles.container}>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={[styles.form, { marginTop: 18 }]}>
          <TouchableOpacity
            style={styles.item}
            onPress={() =>
              router.navigate("/(authenticated)/(tabs)/account/profile")
            }
          >
            <Image
              style={styles.imageIcon}
              source={require("@/src/assets/icons/account.jpg")}
            />
            <ThemedText
              type={TextType.SubheadlineRegular}
              color={TextColor.Primary}
            >
              {t("settings.editaccount")}
            </ThemedText>
            <View style={styles.right}>
              <Entypo
                name="chevron-thin-right"
                size={20}
                color={TextColor.Placeholder}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.item}
            onPress={() =>
              router.navigate("/(authenticated)/(tabs)/account/change-password")
            }
          >
            <Image
              style={styles.imageIcon}
              source={require("@/src/assets/icons/lock.jpg")}
            />
            <ThemedText
              type={TextType.SubheadlineRegular}
              color={TextColor.Primary}
            >
              {t("settings.resetpassword")}
            </ThemedText>
            <View style={styles.right}>
              <Entypo
                name="chevron-thin-right"
                size={20}
                color={TextColor.Placeholder}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.item}
            onPress={() =>
              router.navigate("/(authenticated)/(tabs)/account/category")
            }
          >
            <Image
              style={styles.imageIcon}
              source={require("@/src/assets/icons/change.jpg")}
            />
            <ThemedText
              type={TextType.SubheadlineRegular}
              color={TextColor.Primary}
            >
              {t("settings.categories")}
            </ThemedText>
            <View style={styles.right}>
              <Entypo
                name="chevron-thin-right"
                size={20}
                color={TextColor.Placeholder}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.item}
            onPress={() =>
              router.navigate("/(authenticated)/(tabs)/account/budget")
            }
          >
            <Image
              style={styles.imageIcon}
              source={require("@/src/assets/icons/parts.jpg")}
            />
            <ThemedText
              type={TextType.SubheadlineRegular}
              color={TextColor.Primary}
            >
              {t("settings.budgets")}
            </ThemedText>
            <View style={styles.right}>
              <Entypo
                name="chevron-thin-right"
                size={20}
                color={TextColor.Placeholder}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.item}
            onPress={() =>
              router.navigate("/(authenticated)/(tabs)/account/goal")
            }
          >
            <Image
              style={styles.imageIcon}
              source={require("@/src/assets/icons/goals-active.jpg")}
            />
            <ThemedText
              type={TextType.SubheadlineRegular}
              color={TextColor.Primary}
            >
              {t("settings.goals")}
            </ThemedText>
            <View style={styles.right}>
              <Entypo
                name="chevron-thin-right"
                size={20}
                color={TextColor.Placeholder}
              />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          <Link
            href={"/(authenticated)/(tabs)/account/languages" as Href}
            asChild
          >
            <TouchableOpacity style={styles.item}>
              <ThemedText
                type={TextType.SubheadlineRegular}
                color={TextColor.Primary}
              >
                {t("settings.language")}
              </ThemedText>
              <View style={styles.right}>
                <Entypo
                  name="chevron-thin-right"
                  size={20}
                  color={TextColor.Placeholder}
                />
              </View>
            </TouchableOpacity>
          </Link>
          <Link
            href={"/(authenticated)/(tabs)/account/currencies" as Href}
            asChild
          >
            <TouchableOpacity style={styles.item}>
              <ThemedText
                type={TextType.SubheadlineRegular}
                color={TextColor.Primary}
              >
                {t("settings.currency")}
              </ThemedText>
              <View style={styles.right}>
                <Entypo
                  name="chevron-thin-right"
                  size={20}
                  color={TextColor.Placeholder}
                />
              </View>
            </TouchableOpacity>
          </Link>
        </View>
        <View style={styles.form}>
          {/* <Link href={'/(authenticated)/(tabs)/account/notifications' as Href} asChild> */}
          {/* <TouchableOpacity style={styles.item}>
              <ThemedText type={TextType.SubheadlineRegular} color={TextColor.Primary}>
                {t('settings.notifications')}
              </ThemedText>
              <View style={styles.right}>
                <Entypo name='chevron-thin-right' size={20} color={TextColor.Placeholder} />
              </View>
            </TouchableOpacity> */}
          {/* </Link> */}
          <Link
            href={"/(authenticated)/(tabs)/account/invests" as Href}
            asChild
          >
            <TouchableOpacity style={styles.item}>
              <ThemedText
                type={TextType.SubheadlineRegular}
                color={TextColor.Primary}
              >
                {t("titles.invest")}
              </ThemedText>
              <View style={styles.right}>
                <Entypo
                  name="chevron-thin-right"
                  size={20}
                  color={TextColor.Placeholder}
                />
              </View>
            </TouchableOpacity>
          </Link>
        </View>
        <View style={styles.form}>
          {/* <Link href={'/(authenticated)/(tabs)/account/notifications' as Href} asChild> */}
          {/* <TouchableOpacity style={styles.item}>
              <ThemedText type={TextType.SubheadlineRegular} color={TextColor.Primary}>
                {t('settings.notifications')}
              </ThemedText>
              <View style={styles.right}>
                <Entypo name='chevron-thin-right' size={20} color={TextColor.Placeholder} />
              </View>
            </TouchableOpacity> */}
          {/* </Link> */}
          <Link
            href={"/(authenticated)/(tabs)/account/setting" as Href}
            asChild
          >
            <TouchableOpacity style={styles.item}>
              <ThemedText
                type={TextType.SubheadlineRegular}
                color={TextColor.Primary}
              >
                {t("settings.settings")}
              </ThemedText>
              <View style={styles.right}>
                <Entypo
                  name="chevron-thin-right"
                  size={20}
                  color={TextColor.Placeholder}
                />
              </View>
            </TouchableOpacity>
          </Link>
        </View>
        <View>
          <Button
            text={t("settings.logout")}
            type="primary"
            size="large"
            state="normal"
            buttonLeft={() => (
              <LogOut width={24} height={24} color={NeutralColor.White[50]} />
            )}
            onPress={handleLogout}
            style={{ backgroundColor: BrandColor.Red[400], marginTop: 32 }}
          />
        </View>
        <View style={{ height: 120 }}></View>
      </ScrollView>
    </View>
  );
};
export default Page;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    // backgroundColor: NeutralColor.White[50]
  },
  form: {
    marginTop: 12,
    borderRadius: 12,
    gap: 1,
    width: "100%",
    overflow: "hidden",
  },
  item: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    height: 52,
    paddingVertical: 14,
    paddingHorizontal: 12,
    gap: 8,
    backgroundColor: BackgroundColor.LightTheme.Primary,
  },
  imageIcon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  right: {
    position: "absolute",
    right: 12,
  },
});
