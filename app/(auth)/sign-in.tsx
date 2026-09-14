import { useState } from "react";
import {
    View,
    Text,
    TextInput,
    Pressable,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { useSignIn } from "@clerk/expo/legacy";
import { isValidEmail, mapClerkError } from "@/lib/validation";

const SignIn = () => {
    const { signIn, setActive, isLoaded } = useSignIn();
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [formError, setFormError] = useState("");
    const [loading, setLoading] = useState(false);

    const isFormValid = isValidEmail(email) && password.length > 0;

    const handleSignIn = async () => {
        if (!isLoaded) return;

        setFormError("");
        setEmailError("");
        setPasswordError("");

        let hasError = false;
        if (!isValidEmail(email)) {
            setEmailError("Adresse email invalide.");
            hasError = true;
        }
        if (password.length === 0) {
            setPasswordError("Le mot de passe est requis.");
            hasError = true;
        }
        if (hasError) return;

        setLoading(true);
        try {
            const attempt = await signIn.create({
                identifier: email.trim(),
                password,
            });

            if (attempt.status === "complete") {
                await setActive({ session: attempt.createdSessionId });
                router.replace("/(tabs)");
            } else {
                setFormError("Connexion incomplète. Réessayez.");
            }
        } catch (err) {
            setFormError(mapClerkError(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            className="auth-safe-area"
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <ScrollView
                className="auth-scroll"
                contentContainerClassName="auth-content"
                keyboardShouldPersistTaps="handled"
            >
                <View className="auth-brand-block">
                    <View className="auth-logo-wrap">
                        <View className="auth-logo-mark">
                            <Text className="auth-logo-mark-text">R</Text>
                        </View>
                        <Text className="auth-wordmark">Recurrly</Text>
                    </View>
                    <Text className="auth-wordmark-sub">Gestion d'abonnements</Text>

                    <Text className="auth-title">Bon retour</Text>
                    <Text className="auth-subtitle">
                        Connectez-vous pour retrouver vos abonnements et votre solde en un
                        coup d'œil.
                    </Text>
                </View>

                <View className="auth-card">
                    <View className="auth-form">
                        <View className="auth-field">
                            <Text className="auth-label">Email</Text>
                            <TextInput
                                className={`auth-input ${emailError ? "auth-input-error" : ""}`}
                                placeholder="vous@exemple.com"
                                autoCapitalize="none"
                                keyboardType="email-address"
                                autoComplete="email"
                                value={email}
                                onChangeText={(text) => {
                                    setEmail(text);
                                    if (emailError) setEmailError("");
                                }}
                            />
                            {emailError ? (
                                <Text className="auth-error">{emailError}</Text>
                            ) : null}
                        </View>

                        <View className="auth-field">
                            <Text className="auth-label">Mot de passe</Text>
                            <TextInput
                                className={`auth-input ${passwordError ? "auth-input-error" : ""}`}
                                placeholder="••••••••"
                                secureTextEntry
                                autoComplete="password"
                                value={password}
                                onChangeText={(text) => {
                                    setPassword(text);
                                    if (passwordError) setPasswordError("");
                                }}
                            />
                            {passwordError ? (
                                <Text className="auth-error">{passwordError}</Text>
                            ) : null}
                        </View>

                        {formError ? (
                            <Text className="auth-error">{formError}</Text>
                        ) : null}

                        <Pressable
                            className={`auth-button ${!isFormValid || loading ? "auth-button-disabled" : ""}`}
                            onPress={handleSignIn}
                            disabled={!isFormValid || loading}
                        >
                            <Text className="auth-button-text">
                                {loading ? "Connexion…" : "Se connecter"}
                            </Text>
                        </Pressable>
                    </View>

                    <View className="auth-divider-row">
                        <View className="auth-divider-line" />
                        <Text className="auth-divider-text">ou</Text>
                        <View className="auth-divider-line" />
                    </View>

                    <View className="auth-link-row">
                        <Text className="auth-link-copy">Pas encore de compte ?</Text>
                        <Link href="/(auth)/sign-up" className="auth-link">
                            Créer un compte
                        </Link>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default SignIn;