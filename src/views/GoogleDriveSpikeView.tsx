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

function FileRespoinseView(props: { files: { [id: string]: File }, deleteCallback: (file: File) => void }) {
    return <div>
        <table>
            <thead>
            <tr>
                <th>id</th>
                <th>name</th>
                <th>content</th>
                <th>action</th>
            </tr>
            </thead>
            <tbody>
                {Object.keys(props.files)
                    .map(key => props.files[key])
                    .map(file =>
                        <tr>
                            <td>{file.id}</td>
                            <td>{file.name}</td>
                            <td>{file.content}</td>
                            <td>
                                <button onClick={() => {
                                    deleteDriveFile(file.id)
                                        .then(() => props.deleteCallback(file));
                                }}>delete
                                </button>
                            </td>
                        </tr>)}
            </tbody>
        </table>
    </div>
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

function deleteDriveFile(id: string) {
    return fetch(`https://www.googleapis.com/drive/v3/files/${id}`, {
        "method": "DELETE",
        "headers": {
            "accept": "application/json",
            "authorization": `Bearer ${UserService.getCurrentUser()?.accessToken}`
        }
    });
}

function deleteDriveFiles(driveFiles: { [p: string]: File }): Promise<any> {
    if (UserService.getCurrentUser())
        return Promise.all(Object.keys(driveFiles)
            .map(id => deleteDriveFile(id)))
    return Promise.resolve();
}

function createFile(file: { name: string; content: string }): Promise<any> {
    return fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart", {
        "method": "POST",
        "headers": {
            "accept": "application/json",
            "content-type": "multipart/related; boundary=nice_boundary_name",
            "authorization": `Bearer ${UserService.getCurrentUser()?.accessToken}`
        },
        "body": `--nice_boundary_name
Content-Type: application/json; charset=UTF-8

{
  "name": "${file.name}"
}

--nice_boundary_name
Content-Type: application/json; charset=UTF-8

${file.content}

--nice_boundary_name--`
    })
        .then(response => {
            console.log(response);
        })
        .catch(err => {
            console.log(err);
        });
}


// ---- updateExample: ----
// curl --request PATCH \
//   --url 'https://www.googleapis.com/upload/drive/v3/files/1J0v7U2B_GswHPo3Vbuu67jYvtls4uaIQ?uploadType=media' \
//   --header 'accept: application/json' \
//   --header 'authorization: Bearer ya29.Il-9ByIRxhjOLylx88WfEC6W1uLG42J16nXiAhVTXUkfoh5LLvGUZyN4aMEwh3rBc0RlV8ncjksxy8dzZ31hqEBuaxh9-fTKqsPoweE8uJonGoYIb6doE-6hgRGfClYS3w' \
//   --header 'content-type: application/json' \
//   --data '{
// "newKey":"withNewValue"
// }'

// ---- search for filename example ----
// curl --request GET \
//   --url 'https://www.googleapis.com/drive/v3/files?q=name%20contains%20'\''Verzeichnis'\''' \
//   --header 'accept: application/json' \
//   --header 'authorization: Bearer ya29.Il-9ByIRxhjOLylx88WfEC6W1uLG42J16nXiAhVTXUkfoh5LLvGUZyN4aMEwh3rBc0RlV8ncjksxy8dzZ31hqEBuaxh9-fTKqsPoweE8uJonGoYIb6doE-6hgRGfClYS3w'

export default () => {
    const [driveFiles, setDriveFiles] = useState<{ [id: string]: File }>({});
    const [newFileContent, setNewFileContent] = useState<string>('{\n  "some": "content"\n}');
    const [newFileName, setNewFileName] = useState<string>(`${Math.random()}.json`);

    useEffect(() => {
        loadFiles(setDriveFiles);
    }, [driveFiles, setDriveFiles]);

    return <div>
        <label>File List of google drive files List metadata<FileRespoinseView files={driveFiles}
                                                                               deleteCallback={file => {
                                                                                   const df = {...driveFiles}
                                                                                   delete df[file.id];
                                                                                   setDriveFiles(df);
                                                                               }
                                                                               }/></label>
        <button onClick={() => {
            deleteDriveFiles(driveFiles)
                .then(() => setDriveFiles({}));
        }}>
            Delete all!
        </button>
        <label>
            File name
            <input value={newFileName} onChange={event => setNewFileName(event.target.value)}/>
        </label>
        <label>
            File content
            <textarea value={newFileContent} onChange={event => setNewFileContent(event.target.value)}/>
        </label>
        <button onClick={() => createFile({name: newFileName, content: newFileContent})
            .then(() => loadFiles(setDriveFiles))}>add
        </button>
    </div>
}

