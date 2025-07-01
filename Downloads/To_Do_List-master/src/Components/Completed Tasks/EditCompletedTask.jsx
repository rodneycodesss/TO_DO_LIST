import React, { useEffect, useReducer } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Calendar from "./Calendar";

function EditCompletedTask() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = location.state || {};

  const reducerListEdit = (state, action) => {
    switch (action.type) {
      case "DISPLAY_DETAILS":
        return action.payload;
      case "EDIT_DISPLAYED_INFO":
        return action.payload;
    }
  };

  const initialData = (id) => {
    const completedObjects = JSON.parse(localStorage.getItem("completed")) || [];
    return completedObjects.find((entry) => entry.id === id);
  }

  //Load the Data from the LocaLStorage and update it into our
  const [TaskEdit, dispatchTaskEdit] = useReducer(reducerListEdit, id, initialData);

  useEffect(() => { 
    const OBJ = JSON.parse(localStorage.getItem("completed"));
    const taskObj = OBJ.find((entry) => entry.id === id);
    dispatchTaskEdit({
      type: "DISPLAY_DETAILS",
      payload: taskObj,
    });
  }, []);

  useEffect(() => {
    if (Array.isArray(TaskEdit)) {
      localStorage.setItem("completed", JSON.stringify(TaskEdit));
      const updatedObj = JSON.parse(localStorage.getItem("completed"));
      const updatedSingleObj = updatedObj.find((entry) => entry.id === id);
      dispatchTaskEdit({
        type: "DISPLAY_DETAILS",
        payload: updatedSingleObj,
      })
    }
  },[TaskEdit])

  const handleDelete = (id) => {
    const completedTasksArr = JSON.parse(localStorage.getItem("completed"));
    console.log(completedTasksArr);
    const newArr = completedTasksArr.filter((event) => id !== event.id);
    localStorage.setItem("completed", JSON.stringify(newArr));
    navigate("/Completed")
  };

  const handleInfoChange =(event, editedSection) => {
    const editingObject = JSON.parse(localStorage.getItem("completed"));
    const value = editingObject.find((entry) => entry.id === id);
    const editedValue = [];
    const valuesObj = {};
    if (typeof value[editedSection] === 'string') {
      value[editedSection] = event.target.value
    } else {
      if (Array.isArray(value[`${editedSection}Arr`])) {
        value[`${editedSection}Arr`].forEach(element => {
          if (element === event.target.value) {
            editedValue.push(event.target.value);
          } else if(typeof element === 'number') {
            if(String(element) === event.target.value) {
              editedValue.push(+event.target.value);
            }else {
              valuesObj[`${element}`] = element
            }
          } else {
            valuesObj[`${element}`] = element
          }
        });
      }
      editedValue.push(valuesObj);
      value[editedSection] = editedValue;
    }
    const updatedArr = editingObject.filter((task) => task.id !== id);
    updatedArr.push(value);
    dispatchTaskEdit({
      type: 'EDIT_DISPLAYED_INFO',
      payload: updatedArr,
    })
  }



  return (
    <div>
      <EditDeTailsContent info={TaskEdit} handleDelete={handleDelete} handleInfoChange={handleInfoChange} />
    </div>
  );
}

export default EditCompletedTask;

const EditDeTailsContent = ({ info, handleDelete, handleInfoChange }) => {
  const { label, reminder } = info;
  const [saveMessage, setSaveMessage] = React.useState("");

  const handleSave = () => {
    // Get all completed tasks
    const completedTasksArr = JSON.parse(localStorage.getItem("completed")) || [];
    // Replace the edited task
    const updatedArr = completedTasksArr.map(task => task.id === info.id ? info : task);
    localStorage.setItem("completed", JSON.stringify(updatedArr));
    setSaveMessage("Changes saved!");
    setTimeout(() => setSaveMessage(""), 2000);
  };

  return (
    <div>
      <div className="flex justify-center">
        <p className="w-4/5 bg-orange-200 rounded-lg text-4xl font-semibold text-center p-2 m-2 pt-4 pb-4">{info.title}</p>
      </div>
      <div className="flex justify-center h-96 mb-2 ">
        <textarea 
          className="w-4/5 bg-white text-lg p-4 border border-gray-300 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all duration-150 resize-none"
          value={info.description}
          onChange={(e)=>{handleInfoChange(e, 'description')}}
          placeholder="Edit description..."
          rows={6}
        ></textarea>
      </div>
      <div className="flex justify-center">
        <div className="flex text-xl w-4/5 pt-3 pb-3">
          <div className="w-1/3">
            <Calendar date={info.date} handleInfoChange={handleInfoChange} />
          </div>
          <div className="w-1/3">
            <label htmlFor="label">Label: </label>
            <select 
              name="label"
              onChange={(e)=>{handleInfoChange(e, 'label')}}
              className="w-full mt-1 p-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              <option value={label?.[0]}>{label?.[0]}</option>
              {Object.keys(label?.[1] || {}).map((key) => {
                return (
                  <option key={key} value={key}>
                    {label?.[1]?.[key]}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="w-1/3">
            <label htmlFor="reminder">Reminders:</label>
            <select 
              name="reminder"
              onChange={(e)=>{handleInfoChange(e, 'reminder')}}
              className="w-full mt-1 p-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
              value={reminder?.[0] || ""}
            >
              <option value={reminder?.[0]}>{reminder?.[0]} Mins</option>
              {/* {Check which are the other options to use } */}
              {Object.keys(reminder?.[1] || {}).map((key) => {
                return (
                  <option key={key} value={key}>
                    {reminder?.[1]?.[key]} Mins
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      </div>
      <div className="flex justify-center mt-4">
        <button
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg text-lg font-semibold shadow"
          onClick={handleSave}
        >
          Save Changes
        </button>
      </div>
      {saveMessage && (
        <div className="text-center mt-2 text-green-600 font-semibold">{saveMessage}</div>
      )}
      <div>
        <div className="text-center mt-2">
          <button className="bg-red-400 hover:bg-green-400 p-3 rounded-lg text-xl"
            onClick={() => {
              handleDelete(info.id);
            }}
          >
            Delete Event
          </button>
        </div>
      </div>
    </div>
  );
};

//ToDo:
// Add a update button to update the info
//On opening a single list, it deletes the remaining objects, look at that





//Format for storing the Label and Reminders
// {Label: [work, {education: Education, home:Home, other: Other}]}

