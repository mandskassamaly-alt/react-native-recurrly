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
import { useSignUp } from "@clerk/expo/legacy";
import { isValidEmail, isValidPassword, mapClerkError } from "@/lib/validation";

const SignUp = () => {
    const { signUp, setActive, isLoaded } = useSignUp();
    const router = useRouter();

    const [step, setStep] = useState<"form" | "verify">("form");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [code, setCode] = useState("");

    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [codeError, setCodeError] = useState("");
    const [formError, setFormError] = useState("");
    const [loading, setLoading] = useState(false);

    const isFormValid = isValidEmail(email) && isValidPassword(password);

    const handleSignUp = async () => {
        if (!isLoaded) return;

        setFormError("");
        setEmailError("");
        setPasswordError("");

        let hasError = false;
        if (!isValidEmail(email)) {
            setEmailError("Adresse email invalide.");
            hasError = true;
        }
        if (!isValidPassword(password)) {
            setPasswordError("8 caractères minimum.");
            hasError = true;
        }
        if (hasError) return;

        setLoading(true);
        try {
            await signUp.create({
                emailAddress: email.trim(),
                password,
            });
            await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
            setStep("verify");
        } catch (err) {
            setFormError(mapClerkError(err));
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async () => {
        if (!isLoaded) return;

        setCodeError("");
        setFormError("");

        if (code.trim().length === 0) {
            setCodeError("Le code est requis.");
            return;
        }

        setLoading(true);
        try {
            const attempt = await signUp.attemptEmailAddressVerification({
                code: code.trim(),
            });

            if (attempt.status === "complete") {
                await setActive({ session: attempt.createdSessionId });
                router.replace("/(tabs)");
            } else {
                setFormError("Vérification incomplète. Réessayez.");
            }
        } catch (err) {
            setCodeError(mapClerkError(err));
        } finally {
            setLoading(false);
        }
    };

    const handleResendCode = async () => {
        if (!isLoaded) return;
        try {
            await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
        } catch (err) {
            setFormError(mapClerkError(err));
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

                    {step === "form" ? (
                        <>
                            <Text className="auth-title">Créer un compte</Text>
                            <Text className="auth-subtitle">
                                Centralisez tous vos abonnements et ne manquez plus jamais un
                                renouvellement.
                            </Text>
                        </>
                    ) : (
                        <>
                            <Text className="auth-title">Vérifiez votre email</Text>
                            <Text className="auth-subtitle">
                                Entrez le code à 6 chiffres envoyé à {email}.
                            </Text>
                        </>
                    )}
                </View>

                <View className="auth-card">
                    {step === "form" ? (
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
                                    placeholder="8 caractères minimum"
                                    secureTextEntry
                                    autoComplete="password-new"
                                    value={password}
                                    onChangeText={(text) => {
                                        setPassword(text);
                                        if (passwordError) setPasswordError("");
                                    }}
                                />
                                {passwordError ? (
                                    <Text className="auth-error">{passwordError}</Text>
                                ) : (
                                    <Text className="auth-helper">
                                        Au moins 8 caractères.
                                    </Text>
                                )}
                            </View>

                            {formError ? (
                                <Text className="auth-error">{formError}</Text>
                            ) : null}

                            <Pressable
                                className={`auth-button ${!isFormValid || loading ? "auth-button-disabled" : ""}`}
                                onPress={handleSignUp}
                                disabled={!isFormValid || loading}
                            >
                                <Text className="auth-button-text">
                                    {loading ? "Création…" : "Créer mon compte"}
                                </Text>
                            </Pressable>
                        </View>
                    ) : (
                        <View className="auth-form">
                            <View className="auth-field">
                                <Text className="auth-label">Code de vérification</Text>
                                <TextInput
                                    className={`auth-input ${codeError ? "auth-input-error" : ""}`}
                                    placeholder="123456"
                                    keyboardType="number-pad"
                                    value={code}
                                    onChangeText={(text) => {
                                        setCode(text);
                                        if (codeError) setCodeError("");
                                    }}
                                />
                                {codeError ? (
                                    <Text className="auth-error">{codeError}</Text>
                                ) : null}
                            </View>

                            {formError ? (
                                <Text className="auth-error">{formError}</Text>
                            ) : null}

                            <Pressable
                                className={`auth-button ${code.trim().length === 0 || loading ? "auth-button-disabled" : ""}`}
                                onPress={handleVerify}
                                disabled={code.trim().length === 0 || loading}
                            >
                                <Text className="auth-button-text">
                                    {loading ? "Vérification…" : "Vérifier"}
                                </Text>
                            </Pressable>

                            <Pressable
                                className="auth-secondary-button"
                                onPress={handleResendCode}
                            >
                                <Text className="auth-secondary-button-text">
                                    Renvoyer le code
                                </Text>
                            </Pressable>
                        </View>
                    )}

                    {step === "form" && (
                        <>
                            <View className="auth-divider-row">
                                <View className="auth-divider-line" />
                                <Text className="auth-divider-text">ou</Text>
                                <View className="auth-divider-line" />
                            </View>

                            <View className="auth-link-row">
                                <Text className="auth-link-copy">Déjà un compte ?</Text>
                                <Link href="/(auth)/sign-in" className="auth-link">
                                    Se connecter
                                </Link>
                            </View>
                        </>
                    )}
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default SignUp;