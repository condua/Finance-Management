import { BackgroundColor, BrandColor, NeutralColor, TextColor } from '@/src/constants/Colors'
import {
  Alert,
  AnimatableStringValue,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { endOfDay, set } from 'date-fns'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useLocale } from '@/src/hooks/useLocale'
import { TouchableOpacity } from 'react-native'
import { Image } from 'react-native'
import Input from '@/src/components/Input'
import MaskInput from 'react-native-mask-input'
import { formatter } from '@/src/utils/formatAmount'
import formatDate from '@/src/utils/formatDate'
import { SafeAreaView } from 'react-native'
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { ChevronDown, ChevronRight, Plus } from 'react-native-feather'
import { ThemedText } from '@/src/components/ThemedText'
import { TextType } from '@/src/types/text'
import { Dimensions } from 'react-native'
import { getImg } from '@/src/utils/getImgFromUri'
import { useAppDispatch, useAppSelector } from '@/src/hooks/hooks'
import { useGetAllCategoriesQuery } from '@/src/features/category/category.service'
import Button from '@/src/components/buttons/Button'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Amount, Budget, Category, FinancialPlan, Goal, Transaction } from '@/src/types/enum'
import { AntDesign, Entypo, Fontisto } from '@expo/vector-icons'
import {
  useCreatePlanMutation,
  useDeleteAmountGoalMutation,
  useDeletePlanMutation,
  useGetPlanByIdQuery,
  useUpdateAmountToGoalMutation,
  useUpdatePlanMutation,
} from '@/src/features/plan/plan.service'

import { Href, Stack, useLocalSearchParams, useRouter } from 'expo-router'

import Header from '@/src/components/navigation/Header'
import HeaderButton from '@/src/components/navigation/HeaderButton'

import { useActionSheet } from '@expo/react-native-action-sheet'
import CurrencyInput from 'react-native-currency-input-fields'
import { validations } from '@/src/utils/validations'
import RNDateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker'
import BottomContainer from '@/src/components/BottomContainer'

const initialGoal: Omit<FinancialPlan, '_id'> = {
  name: '',
  type: 'goal',
  end_date: new Date().toString(),
  attributes: {
    target_amount: 0,
    records: [] as Amount[],
  } as Goal,
}

type AndroidMode = 'date' | 'time'
const screenWidth = Dimensions.get('window').width
const screenHeight = Dimensions.get('window').height


const initalAmount: Pick<Amount, 'amount' | 'createdAt'> = {
  amount: 0,
  createdAt: new Date().toString(),
}

const Page = () => {
  const { walletId } = useAppSelector((state) => state.auth)
  const { id, planId } = useLocalSearchParams() as { id: string, planId: string }
  const [amount, setAmount] = useState(initalAmount)

  const { t } = useLocale()
  const router = useRouter()
  const { currencyCode } = useLocale()
  const { bottom } = useSafeAreaInsets()
  const [show, setShow] = useState(false)
  const [mode, setMode] = useState<AndroidMode>('date')

  const {
    data: fetchedGoal,
    isLoading,
    isError,
  } = useGetPlanByIdQuery({ walletId,  planId })
  const [updateAmount, updateAmountResult] = useUpdateAmountToGoalMutation()
  const [deleteAmount, deleteAmountResult] = useDeleteAmountGoalMutation()

  useEffect(() => {
    if (fetchedGoal) {
      const foundAmount = fetchedGoal?.attributes.records.find((record) => record._id === id) as Amount
      setAmount(foundAmount ?? initalAmount)
    }

    
  }, [id,fetchedGoal])

  useEffect(() => {
    if (updateAmountResult.isSuccess) {
      setAmount(initalAmount)
      router.back()
    } else if (deleteAmountResult.isSuccess) {
      router.navigate('/(authenticated)/(tabs)/account/goal' as Href)
    }
  }, [updateAmountResult, deleteAmountResult])


  const onChange = (event: DateTimePickerEvent, date?: Date) => {
    const currentDate = date
    setShow(false)
    setAmount((prev) => ({ ...prev, createdAt: endOfDay(currentDate ?? new Date()).toString() }))
  }

  const showMode = (currentMode: AndroidMode) => {
    setShow(true)
    setMode(currentMode)
  }
  const showDatepicker = () => {
    showMode('date')
  }

  const handleUpdateAmount = async () => {
    //validate
    

    if (!amount.amount) {
      Alert.alert('Error', 'Amount is required')
      return
    }
    try {
 
      await updateAmount({
        walletId,
        planId,
        recordId: id,
        record: amount
      }).unwrap()
    } catch (error) {
    }
  }

  const handleDeleteAmount = async () => {
    try {
      await deleteAmount({ walletId, planId, recordId: id }).unwrap()
    } catch (error) {
    }
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: t('goals.editamount'),
          header: (props) => (
            <Header
              {...props}
              headerLeft={() => (
                <HeaderButton
                  type='btn'
                  onPress={() => router.back()}
                  button={() => <AntDesign name='arrowleft' size={24} color={TextColor.Primary} />}
                />
              )}
            />
          ),
        }}
      />
      <SafeAreaView style={styles.inner}>
        <View style={{ paddingVertical: 32, gap: 24 }}>
          <View
            style={{
              margin: 'auto',
              borderRadius: 24,
              borderColor: BrandColor.Gray[200],
              borderWidth: 1,
              paddingHorizontal: 12,
              paddingVertical: 8,
              alignItems: 'center',
              minWidth: 100,
            }}
          >
            <ThemedText type={TextType.SubheadlineRegular} color={TextColor.Secondary}>
              {t('goals.goalamount')}
            </ThemedText>
          </View>
        </View>
        <View style={{ gap: 14 }}>
          <View style={{ marginVertical: 12, marginBottom: 30 }}>
            <CurrencyInput
              placeholder='0'
              value={amount.amount ? amount.amount.toString() : ''}
              intlConfig={{ locale: 'de-DE', currency: currencyCode }}
              onValueChange={(text, values) => {
                setAmount((prev) => ({
                  ...prev,
                  amount: Number(text),
                }))
              }}
              style={styles.currencyInput}
            />
          </View>

          <SafeAreaView>
            <View style={{ position: 'absolute', left: 0, top: 4 }}></View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Pressable onPress={showDatepicker} style={[styles.button, { width: '100%' }]}>
                <Fontisto name='date' size={20} color={BrandColor.PrimaryColor[400]} />
                <View style={{ flex: 3 }}>
                  <Text>{formatDate(new Date(amount.createdAt), 'dd/mm/yy')}</Text>
                </View>
                <ChevronDown width={24} height={24} color={TextColor.Placeholder} />
              </Pressable>
            </View>
            <View style={styles.datePicker}>
              {show && (
                <RNDateTimePicker
                  testID='dateTimePicker'
                  value={new Date(amount.createdAt)}
                  mode={mode}
                  display='spinner'
                  is24Hour={true}
                  onChange={onChange}
                />
              )}
            </View>
          </SafeAreaView>
        </View>
      </SafeAreaView>
      <BottomContainer>
        <Button
          type={'tertiary'}
          text={t('actions.delete')}
          size={'large'}
          state={'normal'}
          onPress={handleDeleteAmount}
          isLoading={deleteAmountResult.isLoading}
          style={{ width: '48%' }}
        />
        <Button
          type={'primary'}
          text={t('actions.update')}
          size={'large'}
          state={'normal'}
          onPress={handleUpdateAmount}
          isLoading={updateAmountResult.isLoading}
          style={{ width: '48%' }}
        />
      </BottomContainer>
    </View>
  )
}
export default Page
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NeutralColor.White[50],
    paddingHorizontal: 24,
  },
  item: {
    width: '100%',
    backgroundColor: BrandColor.Gray[50],
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomColor: BrandColor.Gray[100],
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCover: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: BrandColor.Gray[200],
    backgroundColor: BackgroundColor.LightTheme.Primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCategory: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
  },
  bottomSheetModal: {
    width: screenWidth,
    paddingHorizontal: 24,
    borderStartStartRadius: 24,
    flex: 1,
  },
  header: {
    width: '100%',
    height: 60,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 6,
    paddingBottom: 12,
    borderBottomColor: NeutralColor.GrayLight[100],
    borderBottomWidth: 1,
  },
  horizontalBar: {
    width: '20%',
    height: 6,
    backgroundColor: NeutralColor.GrayLight[50],
    borderRadius: 18,
  },
  datePicker: {
    maxHeight: screenHeight * 0.15,
  },
  button: {
    marginTop: 12,
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    justifyContent: 'center',
    height: 54,
    width: screenWidth - 48,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BrandColor.Gray[300],
  },
  inner: {
    flex: 1,
  },
  currencyInput: {
    fontSize: 40,
    fontWeight: 'bold',
    color: TextColor.Primary,
    alignSelf: 'center',
    height: 60,
  },
})
