"use client";

import { ScrollableCardTable } from "@/components/ScrollableCardTable";
import { HNavBar, VStack } from "@/components/layout";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	type TauriUserPackage,
	environmentAddUserPackageWithPicker,
	environmentGetUserPackages,
	environmentRemoveUserPackages,
} from "@/lib/bindings";
import { tc } from "@/lib/i18n";
import { toastError, toastSuccess, toastThrownError } from "@/lib/toast";
import { useFilePickerFunction } from "@/lib/use-file-picker-dialog";
import { toVersionString } from "@/lib/version";
import { useQuery } from "@tanstack/react-query";
import { CircleX } from "lucide-react";
import { useRouter } from "next/navigation";
import { Suspense, useCallback, useId } from "react";

export default function Page() {
	return (
		<Suspense>
			<PageBody />
		</Suspense>
	);
}

function PageBody() {
	const result = useQuery({
		queryKey: ["environmentGetUserPackages"],
		queryFn: environmentGetUserPackages,
	});

	const [envAddUserPackage, dialog] = useFilePickerFunction(
		environmentAddUserPackageWithPicker,
	);

	const addUserPackage = useCallback(
		async function addUserPackage() {
			try {
				switch (await envAddUserPackage()) {
					case "NoFolderSelected":
						break;
					case "InvalidSelection":
						toastError(tc("user packages:toast:invalid selection"));
						break;
					case "AlreadyAdded":
						toastSuccess(tc("user packages:toast:package already added"));
						break;
					case "Successful":
						toastSuccess(tc("user packages:toast:package added"));
						await result.refetch();
						break;
				}
			} catch (e) {
				toastThrownError(e);
			}
		},
		[envAddUserPackage, result],
	);

	const removeUserPackage = useCallback(
		async function removeUserPackage(path: string) {
			try {
				await environmentRemoveUserPackages(path);
				toastSuccess(tc("user packages:toast:package removed"));
				await result.refetch();
			} catch (e) {
				toastThrownError(e);
			}
		},
		[result],
	);

	return (
		<VStack>
			<HNavBar className={"flex-shrink-0"}>
				<HeadingPageName />
				<div className={"flex-grow"} />
				<Button onClick={addUserPackage}>
					{tc("user packages:button:add package")}
				</Button>
			</HNavBar>
			<ScrollableCardTable>
				<RepositoryTableBody
					userPackages={result.data || []}
					removeUserPackage={removeUserPackage}
				/>
			</ScrollableCardTable>
			{dialog}
		</VStack>
	);
}

function HeadingPageName() {
	const router = useRouter();

	const userPackages = useCallback(() => {
		router.push("/repositories");
	}, [router]);

	const button =
		"cursor-pointer py-1.5 font-bold flex-grow-0 hover:bg-secondary rounded-sm p-2";

	return (
		<div className={"flex flex-row -ml-2 gap-1"}>
			<button
				type="button"
				className={`${button} bg-none`}
				onClick={userPackages}
			>
				{tc("packages:community repositories")}
			</button>
			<div className={`${button} bg-secondary`}>
				{tc("packages:user packages")}
			</div>
		</div>
	);
}

function RepositoryTableBody({
	userPackages,
	removeUserPackage,
}: {
	userPackages: TauriUserPackage[];
	removeUserPackage: (path: string) => void;
}) {
	const TABLE_HEAD = [
		"general:name",
		"user packages:path",
		"user packages:version",
		"", // actions
	];

	return (
		<>
			<thead>
				<tr>
					{TABLE_HEAD.map((head, index) => (
						<th
							// biome-ignore lint/suspicious/noArrayIndexKey: static array
							key={index}
							className={
								"sticky top-0 z-10 border-b border-primary bg-secondary text-secondary-foreground p-2.5"
							}
						>
							<small className="font-normal leading-none">{tc(head)}</small>
						</th>
					))}
				</tr>
			</thead>
			<tbody>
				{userPackages.map((pkg) => (
					<PackageRow
						key={pkg.path}
						pkg={pkg}
						remove={() => removeUserPackage(pkg.path)}
					/>
				))}
			</tbody>
		</>
	);
}

function PackageRow({
	pkg,
	remove,
}: {
	pkg: TauriUserPackage;
	remove: () => void;
}) {
	const cellClass = "p-2.5";
	const id = useId();

	const pkgDisplayNames = pkg.package.display_name ?? pkg.package.name;

	return (
		<tr className="even:bg-secondary/30">
			<td className={cellClass}>
				<label htmlFor={id}>
					<p className="font-normal">{pkgDisplayNames}</p>
				</label>
			</td>
			<td className={cellClass}>
				<p className="font-normal">{pkg.path}</p>
			</td>
			<td className={cellClass}>
				<p className="font-normal">{toVersionString(pkg.package.version)}</p>
			</td>
			<td className={`${cellClass} w-0`}>
				<Dialog>
					<Tooltip>
						<TooltipTrigger asChild>
							<DialogTrigger asChild>
								<Button variant={"ghost"} size={"icon"}>
									<CircleX className={"size-5 text-destructive"} />
								</Button>
							</DialogTrigger>
						</TooltipTrigger>
						<TooltipContent>
							{tc("user packages:tooltip:remove package")}
						</TooltipContent>
						<DialogContent>
							<DialogTitle>
								{tc("user packages:dialog:remove package")}
							</DialogTitle>
							<DialogDescription>
								<p className={"whitespace-normal font-normal"}>
									{tc("user packages:dialog:confirm remove description", {
										name: pkgDisplayNames,
										path: pkg.path,
									})}
								</p>
							</DialogDescription>
							<DialogFooter>
								<DialogClose asChild>
									<Button>{tc("general:button:cancel")}</Button>
								</DialogClose>
								<DialogClose asChild>
									<Button onClick={remove} className={"ml-2"}>
										{tc("user packages:dialog:button:remove package")}
									</Button>
								</DialogClose>
							</DialogFooter>
						</DialogContent>
					</Tooltip>
				</Dialog>
			</td>
		</tr>
	);
}
