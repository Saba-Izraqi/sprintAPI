import "reflect-metadata";
import { container } from "tsyringe";
import { glob } from "glob";
import path from "path";

const getInterfaceToken = (className: string) => {
  return "I" + className.replace("Repo", "") + "Repo";
};

export async function registerDependencies() {
  const repoFiles = await glob(path.posix.join(__dirname.replace(/\\/g, "/"), "repos/*.@(ts|js)"));
  for (const filePath of repoFiles) {
    const module = await import(filePath);
    for (const exportedName in module) {
      const RepoClass = module[exportedName];
      if (typeof RepoClass === "function") {
        const token = getInterfaceToken(exportedName);
        container.register(token, { useClass: RepoClass });
        console.success(`Registered ${token}`);
      }
    }
  }

  const servicePath = path.posix.join(__dirname.replace(/\\/g, "/"), "../../app/services");
  const appFiles = await glob(path.posix.join(servicePath, "*.{ts,js}"));

  for (const filePath of appFiles) {
    const module = await import(filePath);
    for (const exportedName in module) {
      const ServiceClass = module[exportedName];
      if (typeof ServiceClass === "function") {
        container.register(ServiceClass, { useClass: ServiceClass });
        console.success(`Registered service: ${exportedName}`);
      }
    }
  }
}
