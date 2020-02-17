import React, {useEffect, useState} from "react";
import UserService from "../core/UserService";

interface File {
    id: string,
    name: string,
    content?: string;
}

interface FileListResponseEntryDto {
    "id": string
    "name": string,
    "mimeType": string
}

interface GoogleFileListResponseDto {
    "files": FileListResponseEntryDto[]
}

function FileRespoinseView(props: { files: { [id: string]: File } }) {
    return <div>
        <table>
            <thead>
            <tr>
                <th>id</th>
                <th>name</th>
                <th>content</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                {Object.keys(props.files)
                    .map(key => props.files[key])
                    .map(file =>
                        <tr>
                            <td>{file.id}</td>
                            <td>{file.name}</td>
                            <td>{file.content}</td>
                        </tr>)}
            </tr>
            </tbody>
        </table>
    </div>
}

function addFileMetadataFor(file: File, setFiles: (value: (((prevState: { [p: string]: File }) => { [p: string]: File }) | { [p: string]: File })) => void) {
    fetch(`https://www.googleapis.com/drive/v3/files/${file.id}`, {
        "method": "GET",
        "headers": {
            "authorization": "Bearer " + UserService.getCurrentUser()?.accessToken
        }
    })
        .then(response => {
            response.json()
        })
        .catch(err => {
            console.log(err);
        });
    ;
}

function loadFiles(setDriveFiles: (value: (((prevState: { [p: string]: File }) => { [p: string]: File }) | { [p: string]: File })) => void) {
    if (UserService.getCurrentUser())
        fetch("https://www.googleapis.com/drive/v3/files?=", {
            "method": "GET",
            "headers": {
                "accept": "application/json",
                "authorization": "Bearer " + UserService.getCurrentUser()?.accessToken
            }
        })
            .then(response => {
                if (response.status !== 200) throw new Error("bad status code");
                return response.json();
            })
            .then(response => {
                return response as GoogleFileListResponseDto
            })
            .then(fileList => {
                const driveFiles = fileList.files
                    .map(({id, name}) => ({[id]: {id, name} as File}))
                    .reduce((f1, f2) => ({...f1, ...f2}));
                setDriveFiles(driveFiles);

                loadFileContentFor(driveFiles, setDriveFiles);
            })
            .catch(err => {
                console.log(err);
            });
}

function loadFileContentFor(driveFiles: { [id: string]: File }, setDriveFiles: (value: (((prevState: { [p: string]: File }) => { [p: string]: File }) | { [p: string]: File })) => void) {
    if (UserService.getCurrentUser())
        Object.keys(driveFiles)
            .forEach(id => {
                fetch(`https://www.googleapis.com/drive/v3/files/${id}?alt=media`, {
                    "method": "GET",
                    "headers": {
                        "authorization": `Bearer ${UserService.getCurrentUser()?.accessToken}`
                    }
                })
                    .then(response => {
                        console.log(response);
                        return response.text()
                    })
                    .then(fileContent => {
                        const df = {...driveFiles};
                        df[id].content = fileContent;
                        setDriveFiles(df)
                    })
                    .catch(err => {
                        console.log(err);
                    });
            });
}

export default () => {
    const [driveFiles, setDriveFiles] = useState<{ [id: string]: File }>({});

    useEffect(() => {
        loadFiles(setDriveFiles);
    }, [driveFiles.length]);

    return <div><label>File List of google drive files List metadata<FileRespoinseView files={driveFiles}/></label>
    </div>
}

