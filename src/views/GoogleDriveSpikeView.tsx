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
                        </tr>)}
            </tr>
            </tbody>
        </table>
    </div>
}

export default () => {
    const [driveFiles, setFiles] = useState<{ [id: string]: File }>({});

    useEffect(() => {
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
                    setFiles(fileList.files
                        .map(({id, name}) => ({[id]: ({id, name} as File)}))
                        .reduce((f1, f2) => ({...f1, ...f2})));
                })
                .catch(err => {
                    console.log(err);
                });
    }, [driveFiles.length]);

    return <div><label>File List of google drive files List metadata<FileRespoinseView files={driveFiles}/></label>
    </div>
}

