import AmountItem from '@/src/components/plan/AmountItem'
import { ThemedText } from '@/src/components/ThemedText'
import TransactionItem from '@/src/components/TransactionItem'
import { BackgroundColor, BrandColor, TextColor } from '@/src/constants/Colors'
import { useGetWalletByIdQuery } from '@/src/features/wallet/wallet.service'
import { useAppDispatch, useAppSelector } from '@/src/hooks/hooks'
import { useLocale } from '@/src/hooks/useLocale'
import { TextType } from '@/src/types/text'
import formatDate from '@/src/utils/formatDate'
import { getImg } from '@/src/utils/getImgFromUri'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Dimensions, Image, SafeAreaView, ScrollView } from 'react-native'
import { TouchableOpacity } from 'react-native'
import { StyleSheet, Text, View } from 'react-native'
import { useGetPlanByIdQuery } from '@/src/features/plan/plan.service'
import { skipToken } from '@reduxjs/toolkit/query'
import { Stack } from 'expo-router'
import Header from '@/src/components/navigation/Header'
import HeaderButton from '@/src/components/navigation/HeaderButton'
import { AntDesign } from '@expo/vector-icons'
import { BottomSheetBackdrop, BottomSheetModal } from '@gorhom/bottom-sheet'
import CustomizedModalScrollView from '@/src/components/modals/CustomizedModalScrollView'
import Input from '@/src/components/Input'
import MaskInput from 'react-native-mask-input'
import { formatter } from '@/src/utils/formatAmount'
import { useUpdateAmountToGoalMutation } from '@/src/features/plan/plan.service'
import { Amount } from '@/src/types/enum'

const screenWidth = Dimensions.get('window').width

const initialState: Amount = {
  title: '',
  amount: 0,
  createdAt: new Date().toString(),
}

const History = () => {
  const router = useRouter()
  const { t } = useLocale()
  const { id } = useLocalSearchParams() as { id: string }
  const { walletId } = useAppSelector((state) => state.auth)
  const [amount, setAmount] = useState('')
  const [name, setName] = useState('')
  const { currencyCode } = useLocale()
  const { isLoading, data, isError } = useGetPlanByIdQuery({
    walletId,
    planId: id ?? skipToken,
  })
  const [editAmount, setEditAmount] = useState<Amount>(initialState)
  const [updateAmount, { data: updatedAmount, isSuccess: isUpdated }] =
    useUpdateAmountToGoalMutation()

  useEffect(() => {
    if (isUpdated) {
      bottomSheetModalRef.current?.dismiss()
    }
  }, [isUpdated])

  const bottomSheetModalRef = useRef<BottomSheetModal>(null)

  const snapPoints = useMemo(() => ['70%'], [])

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        opacity={0.3}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior='collapse'
        onPress={() => bottomSheetModalRef.current?.dismiss()}
      />
    ),
    []
  )

  const showModal = (record: Amount) => {
    setEditAmount(record)
    bottomSheetModalRef.current?.present()
  }
  const onSave = async () => {
    if (editAmount) {
      // add amount
      await updateAmount({
        walletId,
        planId: id,
        recordId: editAmount._id,
        record: {
          amount: parseInt(editAmount.amount.toString()),
          title: editAmount.title,
          createdAt: editAmount.createdAt,
        },
      })
    }
  }

  const records = useMemo(() => data?.attributes.records, [data])
  return (
    <SafeAreaView
      style={{
        paddingHorizontal: 24,
        backgroundColor: BackgroundColor.LightTheme.Primary,
        flex: 1,
      }}
    >
      <Stack.Screen
        options={{
          headerTitle: t('goals.history'),
          header: (props) => (
            <Header
              {...props}
              headerLeft={() => (
                <HeaderButton
                  onPress={() => router.back()}
                  type='btn'
                  button={() => <AntDesign name='arrowleft' size={24} color={TextColor.Primary} />}
                />
              )}
            />
          ),
        }}
      />
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {records?.length === 0 && (
          <ThemedText
            type={TextType.FootnoteRegular}
            color={TextColor.Secondary}
            style={{ textAlign: 'center', marginTop: 30 }}
          >
            {t(`home.notransactions`)}
          </ThemedText>
        )}
        {records?.map((item, index) => (
          <TouchableOpacity key={index} onPress={() => showModal(item)}>
            <AmountItem
              title={item.title}
              amount={item.amount}
              date={
                formatDate(item?.createdAt ? new Date(item?.createdAt) : new Date(), 'dd/mm/yy')!
              }
            />
          </TouchableOpacity>
        ))}
        <View style={{ height: 100 }}></View>
      </ScrollView>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        handleComponent={null}
        enableOverDrag={false}
        enablePanDownToClose
      >
        <CustomizedModalScrollView
          headerLabel={t('goals.addamount')}
          buttonText={t('goals.add')}
          onPress={() => onSave()}
        >
          <View style={{ paddingVertical: 14, gap: 24 }}>
            <Input
              placeholder={t('goals.titleamount')}
              validationOptions={{
                required: [true, 'Title is required'],
                minLength: [3, 'Name must be at least 3 characters'],
                pattern: [/^[a-zA-Z0-9\s]+$/, 'Name must be alphanumeric'],
              }}
              value={editAmount?.title}
              onChangeText={(text) => setEditAmount((pre) => ({ ...pre, title: text }))}
            />
            <View style={styles.goalCard}>
              <View style={styles.name}>
                <ThemedText color={TextColor.Secondary} type={TextType.FootnoteRegular}>
                  {t('goals.amount')}
                </ThemedText>
              </View>
              <MaskInput
                value={editAmount?.amount.toString()}
                style={styles.amountText}
                keyboardType='numeric'
                autoFocus={false}
                placeholder={formatter(0, currencyCode)}
                placeholderTextColor={TextColor.Placeholder}
                maskAutoComplete={true}
                onChangeText={(masked, unmasked) => {
                  setEditAmount((pre) => ({ ...pre, amount: parseInt(masked) })) // you can use the unmasked value as well
                }}
              />
            </View>
          </View>
        </CustomizedModalScrollView>
      </BottomSheetModal>
    </SafeAreaView>
  )
}
export default History
const styles = StyleSheet.create({
  name: {
    minWidth: 102,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: BrandColor.Gray[200],
  },
  goalCard: {
    gap: 6,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: screenWidth - 48,
    height: 150,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BrandColor.Gray[300],
  },
  amountText: {
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 36,
    letterSpacing: -0.4,
    color: TextColor.Primary,
    textAlign: 'center',
  },
})
