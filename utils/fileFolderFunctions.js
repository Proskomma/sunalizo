import React, { useEffect } from 'react';
import * as FileSystem from 'expo-file-system';


const getFilesInDirectory = async (path) => {

    const directory = FileSystem.documentDirectory + path;
    const files = await FileSystem.readDirectoryAsync(directory);
    return files;
};

const getInfoFolder = async (path) => {
    const filePath = `${FileSystem.documentDirectory}${path}`;
    return await FileSystem.getInfoAsync(filePath)
}

const getAllInDirectory = async (path) => {

    const directory = FileSystem.documentDirectory + path;
    const files = await FileSystem.readDirectoryAsync(directory);
    return files;
};
async function deleteAssetsFolder() {
    try {
        const folderPath = `${FileSystem.documentDirectory}assets`;
        await FileSystem.deleteAsync(folderPath);
        console.log('Assets folder deleted:', folderPath);
    } catch (error) {
        console.error('Error deleting assets folder:', error);
    }
}

async function deleteNoteFolder() {
    try {
        const folderPath = `${FileSystem.documentDirectory}note`;
        await FileSystem.deleteAsync(folderPath);
        console.log('Assets folder deleted:', folderPath);
    } catch (error) {
        console.error('Error deleting assets folder:', error);
    }
}

async function deleteDicFolder() {
    try {
        const folderPath = `${FileSystem.documentDirectory}dictionary`;
        await FileSystem.deleteAsync(folderPath);
        console.log('Assets folder deleted:', folderPath);
    } catch (error) {
        console.error('Error deleting assets folder:', error);
    }
}
export async function getContentOfFile(path) {
    const directory = FileSystem.documentDirectory + path;
    const files = await FileSystem.readAsStringAsync(directory);
    return JSON.parse(files)
};
const createAssetsFolder = async () => {
    try {
        const directory = `${FileSystem.documentDirectory}assets`;
        await FileSystem.makeDirectoryAsync(directory, { intermediates: true });
        console.log('Assets folder created successfully:', directory);
    } catch (error) {
        console.log('Error creating assets folder:', error);
    }
};

const createFolder = async (path) => {
    try {
        const directory = `${FileSystem.documentDirectory}path`;
        await FileSystem.makeDirectoryAsync(directory, { intermediates: true });
        console.log(`Folder at ${path} created successfully:`, directory);
    } catch (error) {
        console.log('Error creating assets folder:', error);
    }
};
function createFileIfNotExists(path, content) {
    return new Promise((resolve, reject) => {
        const filePath = `${FileSystem.documentDirectory}${path}`;

        FileSystem.getInfoAsync(filePath)
            .then(({ exists }) => {
                if (!exists) {
                    FileSystem.writeAsStringAsync(filePath, JSON.stringify(content))
                        .then(() => {
                            console.log('File created:', filePath);
                            resolve(true);
                        })
                        .catch(error => {
                            //console.error('Error creating file:', error);
                            reject(false);
                        });
                } else {
                    //console.log('File already exists:', filePath);
                    resolve(true);
                }
            })
            .catch(error => {
                console.error('Error checking file:', error);
                reject(false);
            });
    });
}
function deleteFileIfExists(filePath) {
    return new Promise((resolve, reject) => {
        FileSystem.getInfoAsync(`${FileSystem.documentDirectory}${filePath}`)
            .then(({ exists }) => {
                if (exists) {
                    FileSystem.deleteAsync(`${FileSystem.documentDirectory}${filePath}`)
                        .then(() => {
                            console.log('File deleted:', `${FileSystem.documentDirectory}${filePath}`);
                            resolve(true);
                        })
                        .catch(error => {
                            console.error('Error deleting file:', error);
                            reject(false);
                        });
                } else {
                    console.log('File does not exist:', `${FileSystem.documentDirectory}${filePath}`);
                    resolve(true);
                }
            })
            .catch(error => {
                console.error('Error checking file:', error);
                reject(false);
            });
    });
}
function createFolderIfNotExists(path) {
    return new Promise((resolve, reject) => {
        const folderPath = `${FileSystem.documentDirectory}${path}`;
        FileSystem.getInfoAsync(folderPath)
            .then(({ exists }) => {
                if (!exists) {
                    FileSystem.makeDirectoryAsync(folderPath)
                        .then(() => {
                            console.log('Folder created:', folderPath);
                            resolve(true);
                        })
                        .catch(error => {
                            //console.error('Error creating folder:', error);
                            reject(false);
                        });
                } else {
                    //console.log('Folder already exists:', folderPath);
                    resolve(true);
                }
            })
            .catch(error => {
                console.error('Error checking folder:', error);
                reject(false);
            });
    });
}
function deleteFolderIfExist(path) {
    return new Promise((resolve, reject) => {
        const folderPath = `${FileSystem.documentDirectory}${path}`;
        FileSystem.getInfoAsync(folderPath)
            .then(({ exists }) => {
                if (exists) {
                    FileSystem.deleteAsync(folderPath, { idempotent: true })
                        .then(() => {
                            console.log('Folder deleted:', folderPath);
                            resolve(true);
                        })
                        .catch(error => {
                            //console.error('Error deleting folder:', error);
                            reject(false);
                        });
                } else {
                    //console.log('Folder does not exist:', folderPath);
                    resolve(true);
                }
            })
            .catch(error => {
                console.error('Error checking folder:', error);
                reject(false);
            });
    });
}


const creatFileInFolder = async (directory, filecontent) => {
    let directoryPath = FileSystem.documentDirectory + directory
    try {
        await FileSystem.writeAsStringAsync(directoryPath, filecontent);
        console.log('File created successfully:');
    } catch (error) {
        console.log('Error creating files:', error);
    }
}

export { deleteFolderIfExist, deleteFileIfExists, deleteDicFolder, deleteNoteFolder, getInfoFolder, deleteAssetsFolder, createFileIfNotExists, createFolderIfNotExists, getAllInDirectory, createFolder, getFilesInDirectory, createAssetsFolder, creatFileInFolder };
