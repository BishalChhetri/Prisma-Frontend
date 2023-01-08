import styles from "../styles/tasks.module.css";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { TbTrash } from "react-icons/tb";
import { useEffect, useState } from "react";
import { BsFillCheckCircleFill, BsSlack } from "react-icons/bs";
import { BsX } from "react-icons/bs";
import "../index.css";
import { AppBar, Toolbar, Typography, Button } from "@material-ui/core";
import callApi from "../routes/api";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../assets/logo.png";
import AddTask from "../components/AddTask";
import EditTask from "../components/EditTask";

export default function Tasks() {
  const navigate = useNavigate();
  const [addTask, setAddTask] = useState(false);

  const [viewTask, setViewTask] = useState({
    edit: false,
    task: [{ id: "", title: "", description: "", isCompleted: false }],
  });
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({ title: "", description: "" });
  let completedTasks = 0;
  const [tasks, setTasks] = useState([
    {
      id: "",
      title: "",
      description: "",
      isCompleted: false,
    },
  ]);
  let tasksQuantity = 0;
  tasks.length === 1 && tasks[0].id.length === 0
    ? (tasksQuantity = 0)
    : (tasksQuantity = tasks.length);

  tasksQuantity === 1 && tasks[0].id.length === 0
    ? 0
    : (completedTasks = tasks.filter((task) => task.isCompleted).length);

  //Get Task function
  const getAllTasks = async () => {
    if (localStorage.getItem("id") === null) {
      return navigate("/signin");
    }
    try {
      const response = await callApi({
        url: `tasks/${localStorage.getItem("id")}`,
        method: "GET",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwttoken"),
        },
      });
      setTasks(response.data.task);
    } catch (e: any) {
      return toast.error(`${e.response.data.message}`, {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    }
  };

  useEffect(() => {
    getAllTasks();
  }, [viewTask, addTask]);

  // Get task wrt search
  useEffect(() => {
    if (search.length > 0) {
      setTimeout(() => {
        const filterTask = tasks.filter((task) =>
          task.title.toLowerCase().includes(search.toLowerCase())
        );
        setTasks(filterTask);
      }, 2000);
    } else getAllTasks();
  }, [search]);

  // update status of the task
  const onComplete = async (id: string, title: string, description: string) => {
    try {
      const response = await callApi({
        url: `tasks/${localStorage.getItem("id")}/update/${id}`,
        method: "POST",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwttoken"),
        },
        data: {
          title,
          description,
          isCompleted: true,
        },
      });
      getAllTasks();
    } catch (e: any) {
      return toast.error(`${e.response.data.message}`, {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    }
  };

  // View or edit task dialog open
  const onView = (id: string) => {
    const task = tasks.filter((task) => task.id === id);
    setViewTask({ edit: true, task });
  };

  // handle delete task
  const onDelete = async (id: string) => {
    try {
      const response = await callApi({
        url: `tasks/${localStorage.getItem("id")}/delete/${id}`,
        method: "GET",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwttoken"),
        },
      });
      getAllTasks();
      toast.success("Deleted Task.", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    } catch (e: any) {
      toast.error(`${e.response.data.message}`, {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    }
  };

  // Get task wrt status
  const handleFilter = async (e: React.ChangeEvent<any>) => {
    e.preventDefault();
    const { name, value } = e.target ? e.target : e;
    if (value === "all") return getAllTasks();
    const response = await callApi({
      url: `tasks/${localStorage.getItem("id")}/${value}`,
      method: "GET",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwttoken"),
      },
    });
    setTasks(response.data.task);
  };

  //handle logout user
  const handleLogOut = async (e: React.ChangeEvent<any>) => {
    const response = await callApi({
      url: `auth/signout`,
      method: "GET",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwttoken"),
      },
    });
    localStorage.removeItem("id");
    localStorage.removeItem("jwttoken");
    toast.info("Logging Out.", {
      position: toast.POSITION.BOTTOM_LEFT,
    });
    setTimeout(() => navigate("/signin"), 1500);
  };

  return (
    <div className={styles.tasks_div}>
      <div>
        <AppBar position="static" style={{ backgroundColor: "gray" }}>
          <Toolbar>
            <Typography>
              <img src={logo} width="50rem" />
            </Typography>

            <div style={{ flexGrow: 1 }}></div>
            <div>
              <Button
                aria-controls="simple-menu"
                aria-haspopup="true"
                className={styles.appbar_button}
                style={{
                  color: "#ffffff",
                  fontWeight: "bold",
                  fontSize: "0.7rem",
                  backgroundColor: "transparent",
                  borderRadius: "6px",
                  margin: "2px",
                }}
                onClick={() => navigate("/updatePassword")}
              >
                Change Password
              </Button>

              <Button
                aria-controls="simple-menu"
                aria-haspopup="true"
                onClick={handleLogOut}
                style={{
                  color: "#ffffff",
                  fontWeight: "bold",
                  fontSize: "0.7rem",
                  backgroundColor: "transparent",
                  borderRadius: "6px",
                  margin: "2px",
                }}
              >
                Logout
              </Button>
            </div>
          </Toolbar>
        </AppBar>
        <header className={styles.header}>
          <div className={styles.newTaskForm}>
            <input
              placeholder="Search task"
              type="text"
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              // value={title}
            />
            <button onClick={() => setAddTask(!addTask)}>
              Create <AiOutlinePlusCircle size={20} />
            </button>
          </div>
        </header>

        <section className={styles.tasks}>
          <header className={styles.header}>
            <div>
              <p>Created tasks</p>
              <span>{tasksQuantity}</span>
            </div>

            <div>
              <p className="text-[color:#00008B]">Completed tasks</p>
              <span>
                {completedTasks} of {tasksQuantity}
              </span>
            </div>
            <div className="relative xs:max-w-xs">
              <select
                className="p-2.5 m-1 w-32 text-gray-500 bg-white border rounded-md shadow-sm outline-none appearance-none focus:border-indigo-600"
                name="status"
                onChange={handleFilter}
              >
                <option defaultValue="all" value="all">
                  All
                </option>
                <option value="false">Not Started</option>
                <option value="true">Completed</option>
              </select>
            </div>
          </header>

          <div className="flex flex-col gap-3">
            {tasks.map((task) =>
              task.id.length > 0 ? (
                <div className={styles.task} key={task.id}>
                  <button
                    className={styles.checkContainer}
                    onClick={() =>
                      onComplete(task.id, task.title, task.description)
                    }
                  >
                    {task.isCompleted ? <BsFillCheckCircleFill /> : <div />}
                  </button>

                  <p className={task.isCompleted ? styles.textCompleted : ""}>
                    {task.title}
                  </p>
                  {
                    <button
                      className="text-[color:#808080]"
                      onClick={() => onView(task.id)}
                    >
                      {task.isCompleted ? "View" : "Edit"}
                    </button>
                  }
                  <button
                    className="text-[color:#808080]"
                    onClick={() => onDelete(task.id)}
                  >
                    <TbTrash size={20} />
                  </button>
                </div>
              ) : (
                ""
              )
            )}
          </div>
        </section>
        <ToastContainer />
      </div>
      <AddTask isOpen={addTask} closeAddTaskModal={() => setAddTask(false)} />
      <EditTask
        isOpen={viewTask.edit}
        closeEditTaskModal={() => setViewTask({ ...viewTask, edit: false })}
        task={viewTask.task}
      />
    </div>
  );
}
