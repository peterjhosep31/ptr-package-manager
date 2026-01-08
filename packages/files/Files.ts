import fs from "node:fs";
import Directory from "../Directory/Directory.ts";
import CustomError from "../Error/Error.ts";

class Files {

    private DIRECTORY: Directory;

    constructor() {
        this.DIRECTORY = new Directory();
    }

    readFile(
        filePath: string
    ): string {

        if (!this.DIRECTORY.exists(filePath))
            throw new CustomError('File does not exist', {
                cause: `File not found: ${filePath}`
            });

        try {

            return fs.readFileSync(filePath, "utf-8");

        } catch (error: any) {

            throw new CustomError('Error reading file', {
                cause: String(error.message)
            });
        }
    }

    writeFile(
        filePath: string,
        data: string
    ): boolean {

        try {

            fs.writeFileSync(filePath, data, "utf-8");
            return true;

        } catch (error: any) {

            throw new CustomError('Error writing file', {
                cause: String(error.message)
            });
        }
    }

    deleteFile(
        filePath: string
    ): boolean {

        try {

            fs.unlinkSync(filePath);
            return true;

        } catch (error: any) {

            throw new CustomError('Error deleting file', {
                cause: String(error.message)
            });
        }
    }

    renameFile(
        oldPath: string,
        newPath: string
    ): boolean {

        try {

            fs.renameSync(oldPath, newPath);
            return true;

        } catch (error: any) {

            throw new CustomError('Error renaming file', {
                cause: String(error.message)
            });
        }
    }

    copyFile(
        source: string,
        destination: string
    ): boolean {

        try {

            fs.copyFileSync(source, destination);
            return true;

        } catch (error: any) {

            throw new CustomError('Error copying file', {
                cause: String(error.message)
            });
        }
    }

    replaceInFile(
        filePath: string,
        searchValue: string,
        replaceValue: string
    ): boolean {

        try {

            const fileContent = this.readFile(filePath);
            if (!fileContent) return false;

            const updatedContent =
                fileContent.replace(searchValue, replaceValue);
            this.writeFile(filePath, updatedContent);
            return true;

        } catch (error: any) {

            throw new CustomError('Error replacing text in file', {
                cause: String(error.message)
            });
        }
    }


}

export default Files;
