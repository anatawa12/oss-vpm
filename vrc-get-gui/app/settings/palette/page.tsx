"use client"

import {Button} from "@/components/ui/button";
import {Card, CardHeader} from "@/components/ui/card";
import {Checkbox} from "@/components/ui/checkbox";
import {Input} from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem, SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import {HNavBar, VStack} from "@/components/layout";
import {toastError, toastInfo, toastNormal, toastSuccess} from "@/lib/toast";

export default function Page() {
	return (
		<VStack className={"p-4"}>
			<HNavBar className={"flex-shrink-0"}>
				<p className="cursor-pointer py-1.5 font-bold flex-grow-0">
					UI Palette (dev only)
				</p>
			</HNavBar>
			<main className="flex flex-col gap-2 flex-shrink overflow-y-auto flex-grow">
				<Card className={"flex-shrink-0 p-4"}>
					<h2 className={"pb-2"}>File Selector</h2>
					<div className={"flex gap-1 items-center"}>
						<Input className="flex-auto" value={"/some/path/field"} disabled/>
						<Button className={"flex-none px-4"}>Select</Button>
					</div>
				</Card>
				<Card className={"flex-shrink-0 p-4"}>
					<div className={"pb-2 flex align-middle"}>
						<div className={"flex-grow flex items-center"}>
							<h2>Table</h2>
						</div>
						<Button size={"sm"} className={"m-1"}>Add Unity</Button>
					</div>
					<Card className="w-full overflow-x-auto overflow-y-scroll min-h-[20vh]">
						<CardHeader>
							<UnityTable/>
						</CardHeader>
					</Card>
				</Card>
				<Card className={"flex-shrink-0 p-4"}>
					<h2>Dropdown Selector</h2>
					<div className="mt-2">
						<label className={"flex items-center"}>
							<h3>Selector</h3>
							<Select>
								<SelectTrigger>
									<SelectValue/>
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										<SelectItem value={"default"}>Option 0</SelectItem>
										<SelectItem value={"zip-store"}>Option 1</SelectItem>
										<SelectLabel>Select Label</SelectLabel>
										<SelectItem value={"zip-fast"}>Option 2</SelectItem>
										<SelectItem value={"zip-best"}>Option3</SelectItem>
									</SelectGroup>
								</SelectContent>
							</Select>
						</label>
					</div>
				</Card>
				<Card className={"flex-shrink-0 p-4"}>
					<p className={"whitespace-normal"}>
						Some Description Here
					</p>
					<label className={"flex items-center"}>
						<div className={"p-3"}>
							<Checkbox/>
						</div>
						Checkbox
					</label>
				</Card>
				<Card className={"flex-shrink-0 p-4"}>
					<h2 className={"pb-2"}>Buttons</h2>
					<div className={"flex gap-2 items-center"}>
						<Button>Normal</Button>
						<Button variant={"destructive"}>Destructive</Button>
						<Button variant={"success"}>Success</Button>
						<Button variant={"info"}>Info</Button>

						<Button variant={"outline-success"}>Outline Success</Button>
						<Button variant={"ghost"}>Ghost</Button>
						<Button variant={"ghost-destructive"}>Ghost Destructive</Button>
					</div>
				</Card>
				<Card className={"flex-shrink-0 p-4"}>
					<h2 className={"pb-2"}>Toasts</h2>
					<div className={"flex gap-2 items-center"}>
						<Button onClick={() => toastNormal("Normal Toast Body")}>Normal</Button>
						<Button variant={"destructive"} onClick={() => toastError("Error Toast Body")}>Error</Button>
						<Button variant={"success"} onClick={() => toastSuccess("Success Toast Body")}>Success</Button>
						<Button variant={"info"} onClick={() => toastInfo("Info Toast Body")}>Info</Button>
					</div>
				</Card>
			</main>
		</VStack>
	)
}

function UnityTable() {
	const unityPaths: [path: string, version: string, fromHub: boolean][] = [
		["/Applications/Unity/Hub/Editor/2019.4.31f1/Unity.app/Contents/MacOS/Unity", "2019.4.31f1", true],
		["/Applications/Unity/Hub/Editor/2022.3.22f1/Unity.app/Contents/MacOS/Unity", "2022.3.22f1", true],
	];
	const UNITY_TABLE_HEAD = ["Version", "Path", "Source"];
	return (
		<table className="relative table-auto text-left">
			<thead>
			<tr>
				{UNITY_TABLE_HEAD.map((head, index) => (
					<th key={index}
							className={`sticky top-0 z-10 border-b border-primary bg-secondary text-secondary-foreground p-2.5`}>
						<small className="font-normal leading-none">{head}</small>
					</th>
				))}
			</tr>
			</thead>
			<tbody>
			{
				unityPaths.map(([path, version, isFromHub]) => (
					<tr key={path} className="even:bg-secondary/30">
						<td className={"p-2.5"}>{version}</td>
						<td className={"p-2.5"}>{path}</td>
						<td className={"p-2.5"}>
							Unity Hub
						</td>
					</tr>
				))
			}
			</tbody>
		</table>
	)
}
