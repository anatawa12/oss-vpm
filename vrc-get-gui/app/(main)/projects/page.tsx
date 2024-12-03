"use client";

import { HNavBar, VStack } from "@/components/layout";
import { tc, tt } from "@/lib/i18n";
import ProjectsListCard from "./projects-list-card";
import { commands } from "@/lib/bindings";
import { type OpenUnityFunction, Result, useOpenUnity } from "@/lib/use-open-unity";
import { useQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { SearchBox } from "@/components/SearchBox";
import { Button } from "@/components/ui/button";
import { assertNever } from "@/lib/assert-never";
import { useDocumentEvent, isFindKey } from "@/lib/events";
import { toastError, toastSuccess, toastThrownError } from "@/lib/toast";
import { useFilePickerFunction } from "@/lib/use-file-picker-dialog";
import { RefreshCw, ChevronDown } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function Page() {
	const result = useQuery({
		queryKey: ["projects"],
		queryFn: commands.environmentProjects,
	});
	const [search, setSearch] = useState("");
	const [loadingOther, setLoadingOther] = useState(false);
	const [createProjectState, setCreateProjectState] = useState<
		"normal" | "creating"
	>("normal");
	const openUnity = useOpenUnity();

	const startCreateProject = () => setCreateProjectState("creating");

	const loading = result.isFetching || loadingOther;

	return (
		<VStack>
			<HNavBar className={"flex-shrink-0"}>
				<ProjectViewHeader
					className={"flex-shrink-0"}
					refresh={() => result.refetch()}
					startCreateProject={startCreateProject}
					isLoading={loading}
					search={search}
					setSearch={setSearch}
				/>
			</HNavBar>
			<main className="flex-shrink overflow-hidden flex w-full h-full">
				<ProjectsListCard
					result={result}
					search={search}
					createProjectState={createProjectState}
					setCreateProjectState={setCreateProjectState}
					openUnity={openUnity}
					loading={loading}
				/>
			</main>
		</VStack>
	);
}

function ProjectViewHeader({
	className,
	refresh,
	startCreateProject,
	isLoading,
	search,
	setSearch,
}: {
	className?: string;
	refresh?: () => void;
	startCreateProject?: () => void;
	isLoading?: boolean;
	search: string;
	setSearch: (search: string) => void;
}) {
	const [addProjectWithPicker, dialog] = useFilePickerFunction(
		commands.environmentAddProjectWithPicker,
	);

	const addProject = async () => {
		try {
			const result = await addProjectWithPicker();
			switch (result) {
				case "NoFolderSelected":
					// no-op
					break;
				case "InvalidSelection":
					toastError(tt("general:toast:invalid directory"));
					break;
				case "Successful":
					toastSuccess(tt("projects:toast:project added"));
					refresh?.();
					break;
				case "AlreadyAdded":
					toastError(tt("projects:toast:project already exists"));
					break;
				default:
					assertNever(result);
			}
		} catch (e) {
			console.error("Error adding project", e);
			toastThrownError(e);
		}
	};

	const searchRef = useRef<HTMLInputElement>(null);

	useDocumentEvent(
		"keydown",
		(e) => {
			if (isFindKey(e)) {
				searchRef.current?.focus();
			}
		},
		[],
	);

	return (
		<div
			className={
				"flex flex-wrap flex-shrink-0 flex-grow-0 flex-row gap-2 items-center w-full"
			}
		>
			<p className="cursor-pointer font-bold flex-grow-0 whitespace-pre mb-0 leading-tight">
				{tc("projects")}
			</p>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						variant={"ghost"}
						size={"icon"}
						onClick={() => refresh?.()}
						disabled={isLoading}
					>
						{isLoading ? (
							<RefreshCw className="w-5 h-5 animate-spin" />
						) : (
							<RefreshCw className={"w-5 h-5"} />
						)}
					</Button>
				</TooltipTrigger>
				<TooltipContent>{tc("projects:tooltip:refresh")}</TooltipContent>
			</Tooltip>

			<SearchBox
				className={"w-max flex-grow"}
				value={search}
				onChange={(e) => setSearch(e.target.value)}
				ref={searchRef}
			/>

			<DropdownMenu>
				<div className={"flex divide-x"}>
					<Button
						className={"rounded-r-none pl-4 pr-3"}
						onClick={startCreateProject}
					>
						{tc("projects:create new project")}
					</Button>
					<DropdownMenuTrigger asChild className={"rounded-l-none pl-2 pr-2"}>
						<Button>
							<ChevronDown className={"w-4 h-4"} />
						</Button>
					</DropdownMenuTrigger>
				</div>
				<DropdownMenuContent>
					<DropdownMenuItem onClick={addProject}>
						{tc("projects:add existing project")}
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			{dialog}
		</div>
	);
}
