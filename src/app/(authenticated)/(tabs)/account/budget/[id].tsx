import Loading from '@/src/components/Loading'
import Header from '@/src/components/navigation/Header'
import HeaderButton from '@/src/components/navigation/HeaderButton'
import { ThemedText } from '@/src/components/ThemedText'
import { BackgroundColor, BrandColor, TextColor } from '@/src/constants/Colors'
import { useDeletePlanMutation, useGetPlanByIdQuery } from '@/src/features/plan/plan.service'
import { useAppSelector } from '@/src/hooks/hooks'
import { useLocale } from '@/src/hooks/useLocale'
import { TextType } from '@/src/types/text'
import formatDate from '@/src/utils/formatDate'
import { getImg } from '@/src/utils/getImgFromUri'
import { AntDesign } from '@expo/vector-icons'
import { Link, Stack, useRouter } from 'expo-router'
import { useLocalSearchParams } from 'expo-router'
import { Alert, TouchableOpacity } from 'react-native'
import Button from '@/src/components/buttons/Button'
import { Image } from 'react-native'
import { StyleSheet, Text, View } from 'react-native'
import TransactionItem from '@/src/components/TransactionItem'
import { ScrollView } from 'react-native-gesture-handler'
import { formatValue } from 'react-native-currency-input-fields'
import categoriesDefault from '@/src/constants/Categories'
import { usePrefetchImmediately } from '@/src/hooks/usePrefetchImmediately'
import { useSettings } from '@/src/hooks/useSetting'
import { abbrValueFormat } from '@/src/utils/abbrValueFormat'
import { getCurrencySymbol } from '@/src/utils/getCurrencySymbol'

const Page = () => {
  const { t } = useLocale()
  const router = useRouter()
  const { id } = useLocalSearchParams() as { id: string }
  const { currencyCode } = useLocale()
  const { decimalSeparator, groupSeparator, disableDecimal, showCurrency, shortenAmount } =
    useSettings().styleMoneyLabel
  const { walletId } = useAppSelector((state) => state.auth)

  const { data, isFetching } = useGetPlanByIdQuery(
    {
      walletId,
      planId: id,
    },
    { refetchOnMountOrArgChange: true, skip: false }
  )
  const [deletePlan, deleteResult] = useDeletePlanMutation()
  const deleteTransactionHandler = async () => {
    try {
      await deletePlan({ walletId, planId: id, type: 'budget' })
      router.back()
    } catch (error) {
      console.log('🚀 ~ handleDelete ~ error:', error)
    }
  }
  const handleDelete = async () => {
    Alert.alert(t('actions.delete'), t('actions.deletemessage'), [
      {
        text: t('actions.cancel'),
        style: 'cancel',
      },
      {
        text: t('actions.delete'),
        style: 'destructive',
        onPress: deleteTransactionHandler,
      },
    ])
  }
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: t('budgets.budgetdetails'),
          header: (props) => (
            <Header
              {...props}
              headerLeft={() => (
                <HeaderButton
                  type='btn'
                  onPress={() => {
                    router.back()
                  }}
                  button={() => <AntDesign name='arrowleft' size={24} color={TextColor.Primary} />}
                />
              )}
              headerRight={() => (
                <HeaderButton
                  type='btn'
                  onPress={() =>
                    router.push(`/(authenticated)/(tabs)/account/budget/edit-budget?id=${id}`)
                  }
                  button={() => <Image  source={require('@/src/assets/icons/edit.png')} style={{width:24, height:24, resizeMode: 'contain'}}/>}
                />
              )}
            />
          ),
        }}
      />
      {<Loading isLoading={isFetching} text='Loading...' />}
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={styles.details}>
          <View style={styles.amount}>
            <View style={styles.label}>
              <ThemedText type={TextType.FootnoteRegular} color={TextColor.Secondary}>
                {t('budgets.targetamount')}
              </ThemedText>
            </View>
            <View style={[styles.value]}>
              <ThemedText type={TextType.HeadlineSemibold} color={BrandColor.PrimaryColor[400]}>
                {shortenAmount
                  ? abbrValueFormat(
                      Number(data?.attributes.target_amount),
                      showCurrency,
                      currencyCode
                    )
                  : formatValue({
                      value: String(data?.attributes.target_amount),
                      decimalSeparator: decimalSeparator,
                      groupSeparator: groupSeparator,
                      suffix: showCurrency ? getCurrencySymbol(currencyCode) : '',
                      decimalScale: disableDecimal ? 0 : 2,
                    })}
              </ThemedText>
            </View>
          </View>
          <View style={styles.info}>
            <View style={styles.item}>
              <View style={styles.label}>
                <ThemedText type={TextType.FootnoteRegular} color={TextColor.Secondary}>
                  {t('budgets.title')}
                </ThemedText>
              </View>
              <View style={styles.value}>
                <ThemedText
                  type={TextType.FootnoteSemibold}
                  color={TextColor.Primary}
                  adjustsFontSizeToFit={false}
                >
                  {data?.name}
                </ThemedText>
              </View>
            </View>
            <View style={styles.item}>
              <View style={styles.label}>
                <ThemedText type={TextType.FootnoteRegular} color={TextColor.Secondary}>
                  {t('budgets.spentamount')}
                </ThemedText>
              </View>
              <View style={styles.value}>
                <ThemedText
                  type={TextType.FootnoteSemibold}
                  color={BrandColor.Red[300]}
                  adjustsFontSizeToFit={false}
                >
                  {shortenAmount
                    ? abbrValueFormat(
                        Number(data?.attributes.spent_amount),
                        showCurrency,
                        currencyCode
                      )
                    : formatValue({
                        value: String(data?.attributes.spent_amount),
                        decimalSeparator: decimalSeparator,
                        groupSeparator: groupSeparator,
                        suffix: showCurrency ? getCurrencySymbol(currencyCode) : '',
                        decimalScale: disableDecimal ? 0 : 2,
                      })}
                </ThemedText>
              </View>
            </View>
            <View style={styles.item}>
              <View style={styles.label}>
                <View style={styles.label}>
                  <ThemedText type={TextType.FootnoteRegular} color={TextColor.Secondary}>
                    {t('transaction.categories')}
                  </ThemedText>
                </View>
              </View>
              <View
                style={[
                  styles.value,
                  {
                    flexDirection: 'row',
                    gap: 4,
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                  },
                ]}
              >
                <View style={styles.icon}>
                  {data?.attributes.categories && (
                    <Image
                      source={getImg(data.attributes.categories[0].icon)}
                      style={styles.iconImg}
                    />
                  )}
                </View>
                <ThemedText
                  type={TextType.FootnoteSemibold}
                  color={TextColor.Primary}
                  adjustsFontSizeToFit={false}
                >
                  {data?.attributes.categories.map((category: any) => category.name).length > 2
                    ? data?.attributes.categories
                        .map((category: any) =>
                          categoriesDefault.includes(category.icon)
                            ? t(`categories.${category.icon}`)
                            : category.name
                        )
                        .join(', ')
                        .slice(0, 20) + '...'
                    : data?.attributes.categories
                        .map((category: any) =>
                          categoriesDefault.includes(category.icon)
                            ? t(`categories.${category.icon}`)
                            : category.name
                        )
                        .join(', ')}
                </ThemedText>
              </View>
            </View>

            <View style={[styles.item]}>
              <View style={styles.label}>
                <ThemedText type={TextType.FootnoteRegular} color={TextColor.Secondary}>
                  {t('budgets.type')}
                </ThemedText>
              </View>
              <View style={styles.value}>
                <ThemedText
                  type={TextType.FootnoteSemibold}
                  color={TextColor.Primary}
                  adjustsFontSizeToFit={false}
                  style={{ textTransform: 'capitalize' }}
                >
                  {data?.type}
                </ThemedText>
              </View>
            </View>
            <View style={[styles.item, { borderBottomWidth: 0 }]}>
              <View style={styles.label}>
                <ThemedText type={TextType.FootnoteRegular} color={TextColor.Secondary}>
                  {t('budgets.duration')}
                </ThemedText>
              </View>
              <View style={styles.value}>
                <ThemedText
                  type={TextType.FootnoteSemibold}
                  color={TextColor.Primary}
                  adjustsFontSizeToFit={false}
                  style={{ textTransform: 'capitalize' }}
                >
                  {`${formatDate(
                    data?.attributes.start_date
                      ? new Date(data?.attributes.start_date)
                      : new Date(),
                    'dd/mm/yy'
                  )} -  ${formatDate(
                    data?.end_date ? new Date(data?.end_date) : new Date(),
                    'dd/mm/yy'
                  )} `}
                </ThemedText>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.historySection}>
          <View style={styles.headerSection}>
            <ThemedText type={TextType.CalloutSemibold} color={TextColor.Primary}>
              {t('home.history')}
            </ThemedText>
          </View>
          <View style={{ gap: 8 }}>
            {data?.attributes?.records?.length === 0 && (
              <ThemedText
                type={TextType.FootnoteRegular}
                color={TextColor.Secondary}
                style={{ textAlign: 'center', marginTop: 30 }}
              >
                {t(`home.notransactions`)}
              </ThemedText>
            )}
            {data?.attributes?.records?.map((item, index) => {
              return (
                <TouchableOpacity key={index}>
                  <TransactionItem
                    style={{
                      backgroundColor: BackgroundColor.LightTheme.Primary,
                      paddingHorizontal: 12,
                      borderRadius: 12,
                    }}
                    title={item.title}
                    category={item.category.name}
                    amount={item.amount}
                    type={item.type}
                    icon={item.category.icon}
                    date={item?.createdAt}
                  />
                </TouchableOpacity>
              )
            })}
          </View>
        </View>
        <View style={{ height: 120 }}></View>
      </ScrollView>
      <View style={styles.bottom}>
        <Button
          text={t('actions.delete')}
          textColor={BackgroundColor.LightTheme.Primary}
          type='primary'
          state='normal'
          size='large'
          style={{ backgroundColor: BrandColor.Red[400] }}
          onPress={handleDelete}
          buttonLeft={() => (
            <Image
              source={require('@/src/assets/icons/recycle-bin.png')}
              style={{ width: 24, height: 24, resizeMode: 'contain' }}
            />
          )}
        />
      </View>
    </View>
  )
}
export default Page
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    flex: 1,
  },
  bottom: {
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
    padding: 24,
    backgroundColor: BackgroundColor.LightTheme.Primary,
  },
  details: {
    gap: 8,
    marginTop: 14,
  },
  amount: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: BackgroundColor.LightTheme.Primary,
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderRadius: 12,
    minHeight: 50,
  },
  label: {},
  value: {
    flex: 4,
    alignItems: 'flex-end',
  },
  info: {
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: BackgroundColor.LightTheme.Primary,

    overflow: 'hidden',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: BackgroundColor.LightTheme.Primary,
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: BrandColor.Gray[200],
  },
  icon: {
    width: 24,
    height: 24,
    paddingHorizontal: 12,
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: BrandColor.Gray[200],
    borderWidth: StyleSheet.hairlineWidth,
  },
  iconImg: {
    width: 12,
    height: 12,
    resizeMode: 'contain',
  },
  document: {
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderRadius: 12,
    minHeight: 140,
    backgroundColor: BackgroundColor.LightTheme.Primary,
    overflow: 'hidden',
  },
  img: {
    width: 100,
    height: 120,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  historySection: {
    flex: 1,
    marginTop: 18,
    gap: 6,
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  link: {
    color: '#2A85FF',
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.4,
    textTransform: 'capitalize',
  },
  info2: {
    marginTop: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
})
