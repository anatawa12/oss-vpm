import globalInfo from "@/lib/global-info";
import deJson from "@/locales/de.json5";
import enJson from "@/locales/en.json5";
import frJson from "@/locales/fr.json5";
import jaJson from "@/locales/ja.json5";
import zh_hansJson from "@/locales/zh_hans.json5";
import zh_hantJson from "@/locales/zh_hant.json5";
import i18next, { t as i18nextt, type Resource } from "i18next";
import { BailoutToCSRError } from "next/dist/shared/lib/lazy-dynamic/bailout-to-csr";
import React from "react";
import { Trans, initReactI18next, useTranslation } from "react-i18next";
import type { TransProps } from "react-i18next/TransWithoutContext";

const languageResources = {
	en: enJson,
	de: deJson,
	ja: jaJson,
	fr: frJson,
	zh_hans: zh_hansJson,
	zh_hant: zh_hantJson,
};

i18next.use(initReactI18next).init({
	resources: languageResources as Resource,
	lng: "en",
	fallbackLng: "en",
	nsSeparator: "::",

	interpolation: {
		// react is xzz safe (in general)
		escapeValue: false,
	},
	react: {
		transKeepBasicHtmlNodesFor: ["br", "strong", "b", "i", "code"],
	},
});

i18next.changeLanguage(globalInfo.language);

export default i18next;
export const languages = Object.keys(languageResources);

function VGTrans(props: TransProps<string>) {
	if (typeof window === "undefined") {
		throw new BailoutToCSRError("VGTrans");
	}

	const { t } = useTranslation();

	return React.createElement(Trans, { ...props, t });
}

export function tc(
	key: string | string[],
	values?: { [key: string]: string | number },
	props?: TransProps<string>,
) {
	const transComponent = React.createElement(VGTrans, {
		i18nKey: key,
		values,
		...props,
	});
	//return React.createElement(React.Suspense, { fallback: "..." }, transComponent); // most page use GlobalInfo, so this is not needed
	return transComponent;
}

export const tt = i18nextt;
