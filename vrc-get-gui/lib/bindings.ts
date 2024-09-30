
// This file was generated by [tauri-specta](https://github.com/oscartbeaumont/tauri-specta). Do not edit this file manually.

/** user-defined commands **/


export const commands = {
async environmentLanguage() : Promise<string> {
    return await TAURI_INVOKE("environment_language");
},
async environmentSetLanguage(language: string) : Promise<null> {
    return await TAURI_INVOKE("environment_set_language", { language });
},
async environmentTheme() : Promise<string> {
    return await TAURI_INVOKE("environment_theme");
},
async environmentSetTheme(theme: string) : Promise<null> {
    return await TAURI_INVOKE("environment_set_theme", { theme });
},
async environmentGetProjectSorting() : Promise<string> {
    return await TAURI_INVOKE("environment_get_project_sorting");
},
async environmentSetProjectSorting(sorting: string) : Promise<null> {
    return await TAURI_INVOKE("environment_set_project_sorting", { sorting });
},
async environmentGetFinishedSetupPages() : Promise<SetupPages[]> {
    return await TAURI_INVOKE("environment_get_finished_setup_pages");
},
async environmentFinishedSetupPage(page: SetupPages) : Promise<null> {
    return await TAURI_INVOKE("environment_finished_setup_page", { page });
},
async environmentClearSetupProcess() : Promise<null> {
    return await TAURI_INVOKE("environment_clear_setup_process");
},
async environmentProjects() : Promise<TauriProject[]> {
    return await TAURI_INVOKE("environment_projects");
},
async environmentAddProjectWithPicker() : Promise<TauriAddProjectWithPickerResult> {
    return await TAURI_INVOKE("environment_add_project_with_picker");
},
async environmentRemoveProject(listVersion: number, index: number, directory: boolean) : Promise<null> {
    return await TAURI_INVOKE("environment_remove_project", { listVersion, index, directory });
},
async environmentRemoveProjectByPath(path: string, directory: boolean) : Promise<null> {
    return await TAURI_INVOKE("environment_remove_project_by_path", { path, directory });
},
async environmentCopyProjectForMigration(sourcePath: string) : Promise<string> {
    return await TAURI_INVOKE("environment_copy_project_for_migration", { sourcePath });
},
async environmentSetFavoriteProject(listVersion: number, index: number, favorite: boolean) : Promise<null> {
    return await TAURI_INVOKE("environment_set_favorite_project", { listVersion, index, favorite });
},
async environmentProjectCreationInformation() : Promise<TauriProjectCreationInformation> {
    return await TAURI_INVOKE("environment_project_creation_information");
},
async environmentCheckProjectName(basePath: string, projectName: string) : Promise<TauriProjectDirCheckResult> {
    return await TAURI_INVOKE("environment_check_project_name", { basePath, projectName });
},
async environmentCreateProject(basePath: string, projectName: string, template: TauriProjectTemplate) : Promise<TauriCreateProjectResult> {
    return await TAURI_INVOKE("environment_create_project", { basePath, projectName, template });
},
async environmentRefetchPackages() : Promise<null> {
    return await TAURI_INVOKE("environment_refetch_packages");
},
async environmentPackages() : Promise<TauriPackage[]> {
    return await TAURI_INVOKE("environment_packages");
},
async environmentRepositoriesInfo() : Promise<TauriRepositoriesInfo> {
    return await TAURI_INVOKE("environment_repositories_info");
},
async environmentHideRepository(repository: string) : Promise<null> {
    return await TAURI_INVOKE("environment_hide_repository", { repository });
},
async environmentShowRepository(repository: string) : Promise<null> {
    return await TAURI_INVOKE("environment_show_repository", { repository });
},
async environmentSetHideLocalUserPackages(value: boolean) : Promise<null> {
    return await TAURI_INVOKE("environment_set_hide_local_user_packages", { value });
},
async environmentDownloadRepository(url: string, headers: { [key in string]: string }) : Promise<TauriDownloadRepository> {
    return await TAURI_INVOKE("environment_download_repository", { url, headers });
},
async environmentAddRepository(url: string, headers: { [key in string]: string }) : Promise<TauriAddRepositoryResult> {
    return await TAURI_INVOKE("environment_add_repository", { url, headers });
},
async environmentRemoveRepository(id: string) : Promise<null> {
    return await TAURI_INVOKE("environment_remove_repository", { id });
},
async environmentImportRepositoryPick() : Promise<TauriImportRepositoryPickResult> {
    return await TAURI_INVOKE("environment_import_repository_pick");
},
async environmentImportDownloadRepositories(channel: string, repositories: TauriRepositoryDescriptor[]) : Promise<AsyncCallResult<number, ([TauriRepositoryDescriptor, TauriDownloadRepository])[]>> {
    return await TAURI_INVOKE("environment_import_download_repositories", { channel, repositories });
},
async environmentImportAddRepositories(repositories: TauriRepositoryDescriptor[]) : Promise<null> {
    return await TAURI_INVOKE("environment_import_add_repositories", { repositories });
},
async environmentExportRepositories() : Promise<null> {
    return await TAURI_INVOKE("environment_export_repositories");
},
async environmentClearPackageCache() : Promise<null> {
    return await TAURI_INVOKE("environment_clear_package_cache");
},
async environmentGetUserPackages() : Promise<TauriUserPackage[]> {
    return await TAURI_INVOKE("environment_get_user_packages");
},
async environmentAddUserPackageWithPicker() : Promise<TauriAddUserPackageWithPickerResult> {
    return await TAURI_INVOKE("environment_add_user_package_with_picker");
},
async environmentRemoveUserPackages(path: string) : Promise<null> {
    return await TAURI_INVOKE("environment_remove_user_packages", { path });
},
async environmentUnityVersions() : Promise<TauriUnityVersions> {
    return await TAURI_INVOKE("environment_unity_versions");
},
async environmentGetSettings() : Promise<TauriEnvironmentSettings> {
    return await TAURI_INVOKE("environment_get_settings");
},
async environmentPickUnityHub() : Promise<TauriPickUnityHubResult> {
    return await TAURI_INVOKE("environment_pick_unity_hub");
},
async environmentPickUnity() : Promise<TauriPickUnityResult> {
    return await TAURI_INVOKE("environment_pick_unity");
},
async environmentPickProjectDefaultPath() : Promise<TauriPickProjectDefaultPathResult> {
    return await TAURI_INVOKE("environment_pick_project_default_path");
},
async environmentPickProjectBackupPath() : Promise<TauriPickProjectBackupPathResult> {
    return await TAURI_INVOKE("environment_pick_project_backup_path");
},
async environmentSetShowPrereleasePackages(value: boolean) : Promise<null> {
    return await TAURI_INVOKE("environment_set_show_prerelease_packages", { value });
},
async environmentSetBackupFormat(backupFormat: string) : Promise<null> {
    return await TAURI_INVOKE("environment_set_backup_format", { backupFormat });
},
async environmentSetReleaseChannel(releaseChannel: string) : Promise<null> {
    return await TAURI_INVOKE("environment_set_release_channel", { releaseChannel });
},
async environmentSetUseAlcomForVccProtocol(useAlcomForVccProtocol: boolean) : Promise<null> {
    return await TAURI_INVOKE("environment_set_use_alcom_for_vcc_protocol", { useAlcomForVccProtocol });
},
async environmentGetDefaultUnityArguments() : Promise<string[]> {
    return await TAURI_INVOKE("environment_get_default_unity_arguments");
},
async environmentSetDefaultUnityArguments(defaultUnityArguments: string[] | null) : Promise<null> {
    return await TAURI_INVOKE("environment_set_default_unity_arguments", { defaultUnityArguments });
},
async projectDetails(projectPath: string) : Promise<TauriProjectDetails> {
    return await TAURI_INVOKE("project_details", { projectPath });
},
async projectInstallPackages(projectPath: string, envVersion: number, packageIndices: number[]) : Promise<TauriPendingProjectChanges> {
    return await TAURI_INVOKE("project_install_packages", { projectPath, envVersion, packageIndices });
},
async projectReinstallPackages(projectPath: string, packageIds: string[]) : Promise<TauriPendingProjectChanges> {
    return await TAURI_INVOKE("project_reinstall_packages", { projectPath, packageIds });
},
async projectResolve(projectPath: string) : Promise<TauriPendingProjectChanges> {
    return await TAURI_INVOKE("project_resolve", { projectPath });
},
async projectRemovePackages(projectPath: string, names: string[]) : Promise<TauriPendingProjectChanges> {
    return await TAURI_INVOKE("project_remove_packages", { projectPath, names });
},
async projectApplyPendingChanges(projectPath: string, changesVersion: number) : Promise<null> {
    return await TAURI_INVOKE("project_apply_pending_changes", { projectPath, changesVersion });
},
async projectClearPendingChanges() : Promise<null> {
    return await TAURI_INVOKE("project_clear_pending_changes");
},
async projectMigrateProjectTo2022(projectPath: string) : Promise<null> {
    return await TAURI_INVOKE("project_migrate_project_to_2022", { projectPath });
},
async projectCallUnityForMigration(channel: string, projectPath: string, unityPath: string) : Promise<AsyncCallResult<string, TauriCallUnityForMigrationResult>> {
    return await TAURI_INVOKE("project_call_unity_for_migration", { channel, projectPath, unityPath });
},
async projectMigrateProjectToVpm(projectPath: string) : Promise<null> {
    return await TAURI_INVOKE("project_migrate_project_to_vpm", { projectPath });
},
async projectOpenUnity(projectPath: string, unityPath: string) : Promise<boolean> {
    return await TAURI_INVOKE("project_open_unity", { projectPath, unityPath });
},
async projectIsUnityLaunching(projectPath: string) : Promise<boolean> {
    return await TAURI_INVOKE("project_is_unity_launching", { projectPath });
},
async projectCreateBackup(channel: string, projectPath: string) : Promise<AsyncCallResult<null, null>> {
    return await TAURI_INVOKE("project_create_backup", { channel, projectPath });
},
async projectGetCustomUnityArgs(projectPath: string) : Promise<string[] | null> {
    return await TAURI_INVOKE("project_get_custom_unity_args", { projectPath });
},
async projectSetCustomUnityArgs(projectPath: string, args: string[] | null) : Promise<boolean> {
    return await TAURI_INVOKE("project_set_custom_unity_args", { projectPath, args });
},
async projectGetUnityPath(projectPath: string) : Promise<string | null> {
    return await TAURI_INVOKE("project_get_unity_path", { projectPath });
},
async projectSetUnityPath(projectPath: string, unityPath: string | null) : Promise<boolean> {
    return await TAURI_INVOKE("project_set_unity_path", { projectPath, unityPath });
},
async utilOpen(path: string, ifNotExists: OpenOptions) : Promise<null> {
    return await TAURI_INVOKE("util_open", { path, ifNotExists });
},
async utilOpenUrl(url: string) : Promise<null> {
    return await TAURI_INVOKE("util_open_url", { url });
},
async utilGetLogEntries() : Promise<LogEntry[]> {
    return await TAURI_INVOKE("util_get_log_entries");
},
async utilGetVersion() : Promise<string> {
    return await TAURI_INVOKE("util_get_version");
},
async utilCheckForUpdate() : Promise<CheckForUpdateResponse | null> {
    return await TAURI_INVOKE("util_check_for_update");
},
async utilInstallAndUpgrade(channel: string, version: number) : Promise<AsyncCallResult<InstallUpgradeProgress, null>> {
    return await TAURI_INVOKE("util_install_and_upgrade", { channel, version });
},
async utilIsBadHostname() : Promise<boolean> {
    return await TAURI_INVOKE("util_is_bad_hostname");
},
async deepLinkHasAddRepository() : Promise<boolean> {
    return await TAURI_INVOKE("deep_link_has_add_repository");
},
async deepLinkTakeAddRepository() : Promise<AddRepositoryInfo | null> {
    return await TAURI_INVOKE("deep_link_take_add_repository");
},
async deepLinkInstallVcc() : Promise<void> {
    await TAURI_INVOKE("deep_link_install_vcc");
}
}

/** user-defined events **/



/** user-defined constants **/



/** user-defined types **/

export type AddRepositoryInfo = { url: string; headers: { [key in string]: string } }
export type AsyncCallResult<P, R> = { type: "Result"; value: R } | { type: "Started" } | { type: "UnusedProgress"; progress: P }
export type CheckForUpdateResponse = { version: number; current_version: string; latest_version: string; update_description: string | null }
export type InstallUpgradeProgress = { type: "DownloadProgress"; received: number; total: number | null } | { type: "DownloadComplete" }
export type LocalizableRustError = { id: string; args: { [key in string]: string } }
export type LogEntry = { time: string; level: LogLevel; target: string; message: string; gui_toast: boolean }
export type LogLevel = "Error" | "Warn" | "Info" | "Debug" | "Trace"
export type OpenOptions = "ErrorIfNotExists" | "CreateFolderIfNotExists" | "OpenParentIfNotExists"
export type RustError = { type: "Unrecoverable"; message: string } | ({ type: "Localizable" } & LocalizableRustError)
export type SetupPages = "Appearance" | "UnityHub" | "ProjectPath" | "Backups" | "SystemSetting"
export type TauriAddProjectWithPickerResult = "NoFolderSelected" | "InvalidSelection" | "AlreadyAdded" | "Successful"
export type TauriAddRepositoryResult = "BadUrl" | "Success"
export type TauriAddUserPackageWithPickerResult = "NoFolderSelected" | "InvalidSelection" | "AlreadyAdded" | "Successful"
export type TauriBasePackageInfo = { name: string; display_name: string | null; description: string | null; aliases: string[]; version: TauriVersion; unity: [number, number] | null; changelog_url: string | null; vpm_dependencies: string[]; legacy_packages: string[]; is_yanked: boolean }
export type TauriCallUnityForMigrationResult = { type: "ExistsWithNonZero"; status: string } | { type: "FinishedSuccessfully" }
export type TauriConflictInfo = { packages: string[]; unity_conflict: boolean }
export type TauriCreateProjectResult = "AlreadyExists" | "TemplateNotFound" | "Successful"
export type TauriDownloadRepository = { type: "BadUrl" } | { type: "Duplicated" } | { type: "DownloadError"; message: string } | { type: "Success"; value: TauriRemoteRepositoryInfo }
export type TauriEnvironmentSettings = { default_project_path: string; project_backup_path: string; unity_hub: string; unity_paths: ([string, string, boolean])[]; show_prerelease_packages: boolean; backup_format: string; release_channel: string; use_alcom_for_vcc_protocol: boolean; default_unity_arguments: string[] | null }
export type TauriImportRepositoryPickResult = { type: "NoFilePicked" } | { type: "ParsedRepositories"; repositories: TauriRepositoryDescriptor[]; unparsable_lines: string[] }
export type TauriPackage = ({ name: string; display_name: string | null; description: string | null; aliases: string[]; version: TauriVersion; unity: [number, number] | null; changelog_url: string | null; vpm_dependencies: string[]; legacy_packages: string[]; is_yanked: boolean }) & { env_version: number; index: number; source: TauriPackageSource }
export type TauriPackageChange = { InstallNew: TauriBasePackageInfo } | { Remove: TauriRemoveReason }
export type TauriPackageSource = "LocalUser" | { Remote: { id: string; display_name: string } }
export type TauriPendingProjectChanges = { changes_version: number; package_changes: ([string, TauriPackageChange])[]; remove_legacy_files: string[]; remove_legacy_folders: string[]; conflicts: ([string, TauriConflictInfo])[] }
export type TauriPickProjectBackupPathResult = { type: "NoFolderSelected" } | { type: "InvalidSelection" } | { type: "Successful" }
export type TauriPickProjectDefaultPathResult = { type: "NoFolderSelected" } | { type: "InvalidSelection" } | { type: "Successful"; new_path: string }
export type TauriPickUnityHubResult = { type: "NoFolderSelected" } | { type: "InvalidSelection" } | { type: "Successful" }
export type TauriPickUnityResult = "NoFolderSelected" | "InvalidSelection" | "AlreadyAdded" | "Successful"
export type TauriProject = { list_version: number; index: number; name: string; path: string; project_type: TauriProjectType; unity: string; unity_revision: string | null; last_modified: number; created_at: number; favorite: boolean; is_exists: boolean }
export type TauriProjectCreationInformation = { templates: TauriProjectTemplate[]; default_path: string }
export type TauriProjectDetails = { unity: [number, number] | null; unity_str: string | null; unity_revision: string | null; installed_packages: ([string, TauriBasePackageInfo])[]; should_resolve: boolean }
export type TauriProjectDirCheckResult = "InvalidNameForFolderName" | "MayCompatibilityProblem" | "WideChar" | "AlreadyExists" | "Ok"
export type TauriProjectTemplate = { type: "Builtin"; id: string; name: string } | { type: "Custom"; name: string }
export type TauriProjectType = "Unknown" | "LegacySdk2" | "LegacyWorlds" | "LegacyAvatars" | "UpmWorlds" | "UpmAvatars" | "UpmStarter" | "Worlds" | "Avatars" | "VpmStarter"
export type TauriRemoteRepositoryInfo = { display_name: string; id: string; url: string; packages: TauriBasePackageInfo[] }
export type TauriRemoveReason = "Requested" | "Legacy" | "Unused"
export type TauriRepositoriesInfo = { user_repositories: TauriUserRepository[]; hidden_user_repositories: string[]; hide_local_user_packages: boolean; show_prerelease_packages: boolean }
export type TauriRepositoryDescriptor = { url: string; headers: { [key in string]: string } }
export type TauriUnityVersions = { unity_paths: ([string, string, boolean])[]; recommended_version: string; install_recommended_version_link: string }
export type TauriUserPackage = { path: string; package: TauriBasePackageInfo }
export type TauriUserRepository = { id: string; url: string | null; display_name: string }
export type TauriVersion = { major: number; minor: number; patch: number; pre: string; build: string }

/** tauri-specta globals **/

import {
	invoke as TAURI_INVOKE,
	Channel as TAURI_CHANNEL,
} from "@tauri-apps/api/core";
import * as TAURI_API_EVENT from "@tauri-apps/api/event";
import { type WebviewWindow as __WebviewWindow__ } from "@tauri-apps/api/webviewWindow";

type __EventObj__<T> = {
	listen: (
		cb: TAURI_API_EVENT.EventCallback<T>,
	) => ReturnType<typeof TAURI_API_EVENT.listen<T>>;
	once: (
		cb: TAURI_API_EVENT.EventCallback<T>,
	) => ReturnType<typeof TAURI_API_EVENT.once<T>>;
	emit: null extends T
		? (payload?: T) => ReturnType<typeof TAURI_API_EVENT.emit>
		: (payload: T) => ReturnType<typeof TAURI_API_EVENT.emit>;
};

export type Result<T, E> =
	| { status: "ok"; data: T }
	| { status: "error"; error: E };

function __makeEvents__<T extends Record<string, any>>(
	mappings: Record<keyof T, string>,
) {
	return new Proxy(
		{} as unknown as {
			[K in keyof T]: __EventObj__<T[K]> & {
				(handle: __WebviewWindow__): __EventObj__<T[K]>;
			};
		},
		{
			get: (_, event) => {
				const name = mappings[event as keyof T];

				return new Proxy((() => {}) as any, {
					apply: (_, __, [window]: [__WebviewWindow__]) => ({
						listen: (arg: any) => window.listen(name, arg),
						once: (arg: any) => window.once(name, arg),
						emit: (arg: any) => window.emit(name, arg),
					}),
					get: (_, command: keyof __EventObj__<any>) => {
						switch (command) {
							case "listen":
								return (arg: any) => TAURI_API_EVENT.listen(name, arg);
							case "once":
								return (arg: any) => TAURI_API_EVENT.once(name, arg);
							case "emit":
								return (arg: any) => TAURI_API_EVENT.emit(name, arg);
						}
					},
				});
			},
		},
	);
}
