import "@/global.css"
import { Text, View } from "react-native";
import {Link} from "expo-router";
import { Pressable} from "react-native";

export default function App() {
  return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text className="text-xl font-bold text-success">
          Welcome to Nativewind!
        </Text>
          <Link href="/OnBoarding" asChild>
              <Pressable className="mt-4 rounded bg-primary p-4">
                  <Text className="text-center text-white">Go to Onboarding</Text>
              </Pressable>
          </Link>

          <Link href="/(auth)/sign-in" asChild>
              <Pressable className="mt-4 rounded bg-primary p-4">
                  <Text className="text-center text-white">Go to Sign in</Text>
              </Pressable>
          </Link>

          <Link href="/(auth)/sign-up" asChild>
              <Pressable className="mt-4 rounded bg-primary p-4">
                  <Text className="text-center text-white">Go to Sign up</Text>
              </Pressable>
          </Link>

          <Link
              href={{
                  pathname: "/subscriptions/[id]",
                  params: { id: "spotify" },
              }}
          >
              Spotify Subscription
          </Link>
          <Link
              href={{
                  pathname: "/subscriptions/[id]",
                  params: { id: "claude" },
              }}
          >
              Claude Max Subscription
          </Link>

      </View>
  );
}