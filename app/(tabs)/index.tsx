import "@/global.css";
import { Text } from "react-native";
import { Link } from "expo-router";
import { Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export default function App() {
  return (
      <SafeAreaView className="flex-1 bg-background p-5">
        <Text className="text-7xl font-bold ">
          Home
        </Text>
          <Text className="text-7xl font-sans-extrabold ">
              Home
          </Text>
          <Link href="/OnBoarding" asChild>
              <Pressable className="mt-4 rounded bg-primary p-4">
                  <Text className="text-center text-white  font-sans-bold">Go to Onboarding</Text>
              </Pressable>
          </Link>

          <Link href="/(auth)/sign-in" asChild>
              <Pressable className="mt-4 rounded bg-primary p-4">
                  <Text className="text-center text-white font-sans-bold">Go to Sign in</Text>
              </Pressable>
          </Link>

          <Link href="/(auth)/sign-up" asChild>
              <Pressable className="mt-4 rounded bg-primary p-4">
                  <Text className="text-center text-white font-sans-bold">Go to Sign up</Text>
              </Pressable>
          </Link>



      </SafeAreaView>
  );
}