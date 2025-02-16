import { useMemo, useState } from "react";
import "./App.css";
import UploadImage from "./component/UploadImage";
import axios from "axios";

type dataType = {
  id: number;
  image?: File | null;
  title?: string;
  previewUrl?: string;
};

function App() {
  const [datas, setDatas] = useState<dataType[]>([
    {
      id: 0,
      image: null,
      title: "",
      previewUrl: "",
    },
  ]);

  const addRow = (): void => {
    const newRow = {
      id: 0,
      image: null,
      title: "",
      previewUrl: "",
    };

    setDatas([...datas, newRow]);
  };

  const headers = useMemo<any[]>(
    () => [
      {
        name: "Preview Image",
      },
      {
        name: "Upload Image",
      },
      {
        name: "Title",
        class: `width-50`,
      },
      {
        name: "Action",
      },
    ],
    []
  );

  const handleDeleteRow = (value: dataType): void => {
    const newDatas = datas.filter((x) => x !== value);
    setDatas(newDatas);
  };

  const handleChangeInput = (e: any, value: dataType): void => {
    setDatas((prevState) =>
      prevState.map((item) =>
        item === value ? { ...item, title: e.target.value } : item
      )
    );
  };

  const handleUploadImage = (e: any, value: dataType): void => {
    let newDatas = [...datas];
    const filesLength = e.target.files.length;
    for (let i = 0; i < filesLength; i++) {
      if (i == 0) {
        const newData = newDatas.find((x) => x === value);
        if (newData) {
          newData.image = e.target.files[i];
          newData.previewUrl = URL.createObjectURL(e.target.files[i]);
        }
      } else {
        const newData = {
          id: 0,
          image: e.target.files[i],
          title: "",
          previewUrl: URL.createObjectURL(e.target.files[i]),
        };
        newDatas.push(newData);
      }
    }

    newDatas = newDatas.filter((x) => x.image !== null);
    setDatas(newDatas);
  };

  const submitFiles = async (e: any): Promise<void> => {
    e.preventDefault();

    const newDataToSent = [...datas.filter((x) => x.image !== null)];
    if (newDataToSent.length == 0) {
      alert("no data to sent");
      return;
    }

    const formData = new FormData();
    datas.forEach((data, index) => {
      Object.entries(data).forEach(([key, value]) => {
        if (value instanceof File) {
          formData.append(`data[${index}][${key}]`, value);
        } else {
          formData.append(`data[${index}][${key}]`, value as string);
        }
      });
    });

    try {
      const response: any = await axios.post(
        "http://localhost:8080/api/uploadFile",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      if (response.data.message === "success") {
        alert("Data has been successfully saved");
        setDatas([
          {
            id: 0,
            image: null,
            title: "",
          },
        ]);
      }
    } catch (err: any) {
      console.error(err);
      const message = err.response.data.message;
      alert(message);
    }
  };

  return (
    <section className="container">
      <div className="row">
        <h2>Upload Car Inspection</h2>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                {headers.map((value, key) => {
                  return (
                    <th
                      key={key}
                      className={value.className ? value.className : ""}
                    >
                      {value.name}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {datas.map((value, key) => {
                return (
                  <tr key={key}>
                    <td className="text-center">
                      {value.image && (
                        <>
                          <img
                            className="image-preview-size"
                            alt="not found"
                            src={value.previewUrl}
                          />
                          <br />
                        </>
                      )}
                    </td>
                    <td className="text-center">
                      <UploadImage
                        onChange={(e) => handleUploadImage(e, value)}
                        className="button-primary"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="title"
                        className="form-control"
                        placeholder="Description"
                        onChange={(e) => handleChangeInput(e, value)}
                        value={value.title}
                        required
                      />
                    </td>
                    <td className="text-center">
                      <button
                        className="button-delete"
                        onClick={() => handleDeleteRow(value)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={4}>
                  <button onClick={addRow} className="button-primary">
                    Add Row
                  </button>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
      <div className="row text-end mt-3">
        <button className="button-primary" onClick={submitFiles}>
          Submit
        </button>
      </div>
    </section>
  );
}

export default App;
