import "@/global.css";
import {FlatList, Image, Text, View} from "react-native";
import images  from '@/constants/images';
import { SafeAreaView } from "react-native-safe-area-context";
import {HOME_BALANCE, HOME_SUBSCRIPTIONS, HOME_USER, UPCOMING_SUBSCRIPTIONS} from "@/constants/data";
import {formatCurrency} from "@/lib/utils";
import {icons} from "@/constants/icons";
import dayjs from "dayjs";
import ListHeading from "@/components/ListHeading";
import UpcomingSubscriptionCard from "@/components/UpcomingSubscriptionCard";
import SubscriptionCard from "@/components/SubscriptionCard";
import {useState} from "react";
export default function App() {
    const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<string | null>(null);

  return (
      <SafeAreaView className="flex-1 bg-background p-5">

              <FlatList
                  ListHeaderComponent={() => (
                      <>

                          <View className="home-header">
                              <View className="home-user">
                                  <Image source={images.avatar} className="home-avatar" />
                                  <Text className="home-user-name">{HOME_USER.name}</Text>
                              </View>

                              <Image source={icons.add} className="home-add-icon" />
                          </View>

                          <View className="my-2.5 min-h-[200px] justify-between gap-5 rounded-bl-[32px] rounded-tr-[32px] bg-accent p-6">
                              <Text className="text-xl font-bold text-white/80">Balance</Text>
                              <View className="flex-row items-center justify-between">
                                  <Text className="text-4xl font-extrabold text-white">
                                      {formatCurrency(HOME_BALANCE.amount)}
                                  </Text>
                                  <Text className="home-balance-date">
                                      {dayjs(HOME_BALANCE.nextRenewalDate).format('MM/DD')}
                                  </Text>
                              </View>
                          </View>

                          <View className="mb-5">
                              <ListHeading title="Upcoming"/>
                              <FlatList
                                  data={UPCOMING_SUBSCRIPTIONS}
                                  renderItem={({ item }) => (
                                      <UpcomingSubscriptionCard {...item} />
                                  )}
                                  keyExtractor={(item) => item.id}
                                  horizontal
                                  showsVerticalScrollIndicator={false}
                                  ListEmptyComponent={<Text className="home-empty-state">No upcoming renewals yet</Text>}

                              />
                          </View>

                          <ListHeading title="All Subscription" />
                      </>
                  )}
                  data={HOME_SUBSCRIPTIONS}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                      <SubscriptionCard
                          {...item}
                          expanded={expandedSubscriptionId === item.id}
                          onPress={() => setExpandedSubscriptionId((currentId) =>
                              (currentId === item.id ? null : item.id))}
                      />
                  )}
                  extraData={expandedSubscriptionId}
                  ItemSeparatorComponent={() => <View className="h-4" />}
                  showsVerticalScrollIndicator={false}
                  ListEmptyComponent={<Text className="home-empty-state">No
                      subscriptions yet.</Text>}
                  contentContainerClassName="pb-40"
              />

      </SafeAreaView>
  );
}