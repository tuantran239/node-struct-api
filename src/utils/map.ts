
import fs from 'fs'
import util from 'util'
import path from 'path'

export const mapPathFolder = async (p: string) => {
    const readdirAsync = await util.promisify(fs.readdir)
    const folders = await readdirAsync(path.join(process.cwd(), p), {})
    return folders.map(folder => path.join(process.cwd(), p, folder as string))
}

export const mapPathFile = async (folders: string[]) => {
    const files: string[] = []
    const readdirAsync = await util.promisify(fs.readdir)
    const filesArray = await Promise.all(folders.map(folder => readdirAsync(folder)))
    for (let i = 0; i < folders.length; i++) {
        const folder = folders[i]
        filesArray[i].forEach(file => {
            files.push(path.join(folder, file))
        })
    }
    return files
}
