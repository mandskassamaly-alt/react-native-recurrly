export function isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function isValidPassword(password: string): boolean {
    return password.length >= 8;
}

export function mapClerkError(error: any): string {
    const code = error?.errors?.[0]?.code;
    const message = error?.errors?.[0]?.message;

    switch (code) {
        case "form_identifier_not_found":
            return "Aucun compte associé à cet email.";
        case "form_password_incorrect":
            return "Mot de passe incorrect.";
        case "form_identifier_exists":
            return "Un compte existe déjà avec cet email.";
        case "form_password_pwned":
            return "Ce mot de passe est trop courant. Choisissez-en un autre.";
        case "form_password_length_too_short":
            return "Le mot de passe doit contenir au moins 8 caractères.";
        case "form_param_format_invalid":
            return "Adresse email invalide.";
        case "form_code_incorrect":
            return "Code de vérification incorrect.";
        case "verification_expired":
            return "Le code a expiré. Demandez-en un nouveau.";
        case "too_many_requests":
            return "Trop de tentatives. Réessayez dans quelques minutes.";
        default:
            return message || "Une erreur est survenue. Réessayez.";
    }
}