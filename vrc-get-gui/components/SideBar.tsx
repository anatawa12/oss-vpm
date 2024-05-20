"use client";

import {Button} from "@/components/ui/button";
import {Card} from "@material-tailwind/react";
import {CloudIcon, Cog6ToothIcon, ListBulletIcon} from "@heroicons/react/24/solid";
import React from "react";
import {Bars4Icon} from "@heroicons/react/24/outline";
import {useQuery} from "@tanstack/react-query";
import {utilGetVersion} from "@/lib/bindings";
import {useTranslation} from "react-i18next";
import {useRouter} from "next/navigation";
import {toastNormal} from "@/lib/toast";

export function SideBar({className}: { className?: string }) {
	"use client"

	const {t} = useTranslation();

	const currentVersionResult = useQuery({
		queryKey: ["utilGetVersion"],
		queryFn: utilGetVersion,
		refetchOnMount: false,
		refetchOnReconnect: false,
		refetchOnWindowFocus: false,
		refetchInterval: false,
	});

	const currentVersion = currentVersionResult.status == "success" ? currentVersionResult.data : "Loading...";

	const copyVersionName = () => {
		if (currentVersionResult.status == "success") {
			navigator.clipboard.writeText(currentVersionResult.data);
			toastNormal(t("sidebar:toast:version copied"));
		}
	};

	return (
		<Card
			className={`${className} w-auto max-w-[20rem] p-2 shadow-xl shadow-blue-gray-900/5 ml-4 my-4 shrink-0`}>
			<div className="flex flex-col gap-1 p-2 min-w-[10rem] flex-grow">
				<SideBarItem href={"/projects"} text={t("projects")} icon={ListBulletIcon}/>
				<SideBarItem href={"/repositories"} text={t("vpm repositories")} icon={CloudIcon}/>
				<SideBarItem href={"/settings"} text={t("settings")} icon={Cog6ToothIcon}/>
				<SideBarItem href={"/log"} text={t("logs")} icon={Bars4Icon}/>
				<div className={'flex-grow'}/>
				<Button variant={"ghost"} className={"text-sm justify-start hover:bg-card"} onClick={copyVersionName}>v{currentVersion}</Button>
			</div>
		</Card>
	);
}

function SideBarItem(
	{href, text, icon}: { href: string, text: string, icon: React.ComponentType<{ className?: string }> }
) {
	const router = useRouter();
	const IconElenment = icon;
	return (
    <Button variant={"ghost"} className={"justify-start"} onClick={() => router.push(href)}>
      <div className={"mr-4"}>
        <IconElenment className="h-5 w-5" />
      </div>
      {text}
    </Button>
	);
}
