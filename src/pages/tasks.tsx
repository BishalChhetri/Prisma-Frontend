import styles from "../styles/tasks.module.css";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { TbTrash } from "react-icons/tb";
import { useEffect, useState } from "react";
import { BsFillCheckCircleFill, BsSlack } from "react-icons/bs";
import { BsX } from "react-icons/bs";
import "../index.css";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  makeStyles,
  Typography,
  TextField,
  Button,
  FormControl,
  AppBar,
  Toolbar,
} from "@material-ui/core";
import callApi from "../routes/api";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../assets/logo.png";

const useStyles = makeStyles((theme) => ({
  dialogWrapper: {
    padding: theme.spacing(1),
    position: "absolute",
    top: theme.spacing(3),
    borderRadius: "12px",
    fontSize: "8px",
  },
}));

export default function Tasks() {
  const navigate = useNavigate();
  const classes = useStyles();
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

  //Get all task for first render
  useEffect(() => {
    getAllTasks();
  }, []);

  // Get task wrt search
  useEffect(() => {
    if (search.length > 0) {
      const filterTask = tasks.filter((task) =>
        task.title.toLowerCase().includes(search)
      );
      setTasks(filterTask);
    } else getAllTasks();
  }, [search]);

  // add Task dialogue open
  const addTaskForm = () => {
    setAddTask(!addTask);
  };

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

  // add task and update task
  const submitTask = async (id: string) => {
    setViewTask({ ...viewTask, edit: false });
    setFormData({ title: "", description: "" });

    if (id === "undefined") {
      try {
        const response = await callApi({
          url: `tasks/${localStorage.getItem("id")}/create`,
          method: "POST",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("jwttoken"),
          },
          data: formData,
        });
        getAllTasks();
        toast.success("Task added sucessfully!", {
          position: toast.POSITION.BOTTOM_LEFT,
        });
      } catch (e: any) {
        return toast.error(`${e.response.data.message}`, {
          position: toast.POSITION.BOTTOM_LEFT,
        });
      }
    } else if (formData.title.length > 0 || formData.description.length > 0) {
      formData.title.length === 0
        ? (formData.title = viewTask.task[0].title)
        : formData.title;

      formData.description.length === 0
        ? (formData.description = viewTask.task[0].description)
        : formData.description;

      try {
        const response = await callApi({
          url: `tasks/${localStorage.getItem("id")}/update/${id}`,
          method: "POST",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("jwttoken"),
          },
          data: { ...formData, isCompleted: viewTask.task[0].isCompleted },
        });
        getAllTasks();
        toast.info("Save Sucessfully!", {
          position: toast.POSITION.BOTTOM_LEFT,
        });
      } catch (e: any) {
        return toast.error(`${e.response.data.message}`, {
          position: toast.POSITION.BOTTOM_LEFT,
        });
      }
    }
    setAddTask(false);
  };

  return (
    <div>
      {addTask ? (
        <Dialog
          open={addTask}
          maxWidth="xs"
          classes={{
            paper: classes.dialogWrapper,
          }}
        >
          <DialogTitle>
            <button
              style={{
                position: "absolute",
                right: "10px",
                top: "5px",
                color: "white",
                cursor: "pointer",
                backgroundColor: "orangered",
                borderRadius: "5px",
              }}
              onClick={() => setAddTask(false)}
            >
              <BsX size={25} />
            </button>
            <Typography variant="h6" component="div">
              Add Task
            </Typography>
          </DialogTitle>
          <DialogContent dividers>
            <FormControl>
              <Typography>Title</Typography>
              <TextField
                id="title"
                label="Title"
                variant="filled"
                style={{
                  width: "250px",
                  margin: "5px",
                  border: "1px solid orangered",
                }}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                error={true}
              ></TextField>

              <Typography>Description</Typography>
              <TextField
                id="description"
                label="Description"
                variant="filled"
                style={{
                  width: "250px",
                  margin: "5px",
                  border: "1px solid orangered",
                }}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                error={true}
              ></TextField>

              <Button
                style={{
                  margin: "5px",
                  backgroundColor: "orange",
                  color: "white",
                }}
                onClick={() => {
                  formData.title.length === 0 ||
                  formData.description.length === 0
                    ? toast.error("All the fields are mandatory!", {
                        position: toast.POSITION.BOTTOM_LEFT,
                      })
                    : submitTask("undefined");
                }}
              >
                Submit
              </Button>
            </FormControl>
          </DialogContent>
        </Dialog>
      ) : (
        ""
      )}
      {viewTask.edit ? (
        <Dialog
          open={viewTask.edit}
          maxWidth="xs"
          classes={{
            paper: classes.dialogWrapper,
          }}
        >
          <DialogTitle>
            <button
              style={{
                position: "absolute",
                right: "35px",
                top: "5px",
                color: "white",
                cursor: "pointer",
                backgroundColor: "red",
                borderRadius: "5px",
              }}
              onClick={() => setViewTask({ ...viewTask, edit: false })}
            >
              <BsX size={20} />
            </button>
          </DialogTitle>
          <DialogContent dividers>
            <FormControl>
              <div style={{ display: "flex" }}>
                <Button
                  style={{
                    margin: "2px",
                    backgroundColor: "transparent",
                    borderRadius: "8px",
                    border: "3px solid orangered",
                  }}
                >
                  Title:
                </Button>
                {viewTask.task[0].isCompleted ? (
                  <Typography
                    variant="h6"
                    style={{
                      marginLeft: "5px",
                      fontSize: "0.8rem",
                      color: "GrayText",
                    }}
                  >
                    {viewTask.task[0].title}
                  </Typography>
                ) : (
                  <TextField
                    required
                    id="title"
                    label="Title"
                    variant="filled"
                    defaultValue={viewTask.task[0].title}
                    style={{ width: "260px", margin: "5px" }}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        title: e.target.value,
                      })
                    }
                    error={true}
                  ></TextField>
                )}
              </div>
              <div style={{ display: "flex" }}>
                <Button
                  style={{
                    margin: "2px",
                    backgroundColor: "transparent",
                    border: "3px solid orangered",

                    borderRadius: "8px",
                  }}
                >
                  Description:
                </Button>
                {viewTask.task[0].isCompleted ? (
                  <Typography
                    variant="h6"
                    style={{
                      marginLeft: "5px",
                      fontSize: "0.8rem",
                      color: "GrayText",
                    }}
                  >
                    {viewTask.task[0].description}
                  </Typography>
                ) : (
                  <TextField
                    required
                    id="description"
                    label="Description"
                    variant="filled"
                    defaultValue={viewTask.task[0].description}
                    style={{ width: "200px", margin: "5px" }}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        description: e.target.value,
                      })
                    }
                    error={true}
                  ></TextField>
                )}
              </div>
              <div style={{ display: "flex" }}>
                <Button
                  style={{
                    margin: "2px",
                    backgroundColor: "transparent",
                    border: "3px solid orangered",

                    borderRadius: "8px",
                  }}
                >
                  Status:
                </Button>
                <Typography
                  variant="h6"
                  style={{
                    marginLeft: "5px",
                    fontSize: "1rem",
                    color: "GrayText",
                  }}
                >
                  {viewTask.task[0].isCompleted ? "Completed" : "Not started"}
                </Typography>
              </div>
              {!viewTask.task[0].isCompleted ? (
                <Button
                  style={{
                    margin: "5px",
                    backgroundColor: "orange",
                    color: "white",
                  }}
                  onClick={() => submitTask(viewTask.task[0].id)}
                >
                  Save Changes
                </Button>
              ) : (
                ""
              )}
            </FormControl>
          </DialogContent>
        </Dialog>
      ) : (
        ""
      )}
      <div>
        <AppBar position="static" style={{ backgroundColor: "#f48915" }}>
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
                  backgroundColor: "#b54",
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
                  backgroundColor: "#b54",
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
            <button onClick={addTaskForm}>
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
              <p className={styles.textPurple}>Completed tasks</p>
              <span>
                {completedTasks} of {tasksQuantity}
              </span>
            </div>
            <div className="relative xs:max-w-xs">
              <select
                className="p-2.5 m-1 w-30 text-gray-500 bg-white border rounded-md shadow-sm outline-none appearance-none focus:border-indigo-600"
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

          <div className={styles.list}>
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
                      className={styles.deleteButton}
                      onClick={() => onView(task.id)}
                    >
                      {task.isCompleted ? "View" : "Edit"}
                    </button>
                  }
                  <button
                    className={styles.deleteButton}
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
    </div>
  );
}
