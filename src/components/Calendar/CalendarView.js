import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "moment/locale/vi"; // Import Vietnamese locale
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
  Paper,
  CircularProgress,
  Autocomplete
} from "@mui/material";
import Navbar from "../Navbar/Navbar";
import { database } from "../../firebase/config";
import { ref, push, set, onValue, remove } from "firebase/database";
import { useAuth } from "../../context/AuthContext";

// Set moment to use Vietnamese locale
moment.locale("vi");
const localizer = momentLocalizer(moment);

const CalendarView = () => {
  const [events, setEvents] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [eventReason, setEventReason] = useState({});
  const [username, setUsername] = useState("");
  const [isAdmin, setIsAdmin] = useState(false); // To be set based on authentication
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const [event, setEvent] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const users = JSON.parse(localStorage.getItem("users") || []);

  const reasonOptions = [
    {
      value: "Nghỉ phép / Nghỉ phiên",
      color: "#3174ad",
    },
    {
      value: "Ra trực",
      color: "#32a852",
    },
    {
      value: "Trực đêm",
      color: "#a83232",
    },
    {
      value: "Trực 24",
      color: "#a16e1e",
    },
    {
      value: "Làm hành chính, không trực",
      color: "#a83271",
    },
  ];

  // Load events from Firebase
  useEffect(() => {
    const eventsRef = ref(database, "events");

    // Get username from localStorage
    const storedUsername = localStorage.getItem("calendar_username");
    if (storedUsername) {
      setUsername(storedUsername);
    }

    // Check if user is admin (in a real app, this would come from auth context)
    // For demo, we'll check if the username contains "admin" or "teacher"
    setIsAdmin(!!currentUser);

    // Fetch events from Firebase
    const unsubscribe = onValue(
      eventsRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const eventsList = Object.entries(data).map(([key, value]) => ({
            ...value,
            id: key,
            start: new Date(value.start),
            end: new Date(value.end),
          }));
          setEvents(eventsList);
        } else {
          setEvents([]);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching events:", error);
        setLoading(false);
      }
    );

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  const handleSelectSlot = (slotInfo) => {
    if (!username && !currentUser) {
      alert("Vui lòng đăng nhập để tạo sự kiện");
      return;
    }

    setSelectedSlot({
      start: slotInfo.start,
      end: slotInfo.end,
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEventReason(null);
    setEvent(null);
  };

  const handleCreateEvent = () => {
    if (!eventReason) {
      alert("Vui lòng chọn lý do cho sự kiện của bạn");
      return;
    }

    const newEvent = {
      title: username || selectedUser?.name || '',
      start: selectedSlot.start.toISOString(),
      end: selectedSlot.end.toISOString(),
      desc: eventReason.value,
      backgroundColor: reasonOptions.find(
        (reason) => reason.value === eventReason.value
      )?.color,
      creator: username,
      createdAt: new Date().toISOString(),
    };

    // Save to Firebase
    const eventsRef = ref(database, "events");
    const newEventRef = push(eventsRef);
    set(newEventRef, newEvent)
      .then(() => {
        console.log("Event saved successfully");
      })
      .catch((error) => {
        console.error("Error saving event:", error);
        alert("Có lỗi khi lưu sự kiện: " + error.message);
      });

    handleCloseDialog();
  };

  const handleSelectEvent = (event) => {
    // Only admin can edit/delete events
    if (!isAdmin) {
      alert("Chỉ quản trị viên mới có thể chỉnh sửa hoặc xóa sự kiện.");
      return;
    } else {
      setEvent(event);
      setOpenDialog(true);
    }
  };

  const deletedEvent = () => {
    if (window.confirm("Bạn có muốn xóa sự kiện này không?")) {
      const eventRef = ref(database, `events/${event.id}`);
      remove(eventRef)
        .then(() => {
          console.log("Event deleted successfully");
          setOpenDialog(false);
        })
        .catch((error) => {
          console.error("Error deleting event:", error);
          alert("Có lỗi khi xóa sự kiện: " + error.message);
        });
    }
  };

  // Custom event style to show random colors
  const eventStyleGetter = (event) => {
    const style = {
      backgroundColor: event.backgroundColor || "#000",
      borderRadius: "5px",
      opacity: 0.8,
      color: "white",
      border: "0px",
      display: "block",
    };
    return {
      style,
    };
  };

  const timing = (start, end) => {
    return `${moment(start).format("HH:mm")} - ${moment(end).format("HH:mm")}`;
  };

  // Vietnamese messages for the calendar
  const vietnameseMessages = {
    allDay: "Cả ngày",
    previous: "Trước",
    next: "Tiếp",
    today: "Hôm nay",
    month: "Tháng",
    week: "Tuần",
    day: "Ngày",
    agenda: "Lịch biểu",
    date: "Ngày",
    time: "Thời gian",
    event: "Sự kiện",
    noEventsInRange: "Không có sự kiện nào trong khoảng thời gian này",
    showMore: (total) => `+ Xem thêm (${total})`,
  };

  return (
    <>
      <Navbar />
      <Box sx={{ height: "calc(100vh - 64px)", padding: 2 }}>
        <Paper elevation={3} sx={{ height: "100%", p: 2 }}>
          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <Calendar
              culture="vi"
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: "100%", width: "100%" }}
              selectable
              onSelectSlot={handleSelectSlot}
              onSelectEvent={handleSelectEvent}
              eventPropGetter={eventStyleGetter}
              views={["month"]}
              defaultView="month"
              messages={vietnameseMessages}
            />
          )}

          {/* Event Creation Dialog */}
          <Dialog
            open={openDialog}
            onClose={handleCloseDialog}
            fullWidth
            maxWidth="sm"
            sx={{
              ".MuiPaper-root": {
                overflow: "visible",
              },
            }}
          >
            <DialogTitle>
              {isAdmin && event ? "Xem sự kiện" : "Tạo Sự Kiện Mới"}
            </DialogTitle>
            <DialogContent>
              <Box sx={{ mb: 2, mt: 1 }}>
                {isAdmin && !event ? (
                  <Autocomplete
                    id="user-select"
                    options={users}
                    getOptionLabel={(option) => option.name}
                    value={selectedUser}
                    onChange={(event, newValue) => {
                      setSelectedUser(newValue);
                    }}
                    filterOptions={(options, { inputValue }) => {
                      const filterValue = inputValue?.toLowerCase();
                      if (!filterValue) return options;
                      if (!options) return [];
                      return options.filter((option) =>
                        option.name.toLowerCase().includes(filterValue)
                      );
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Tìm và chọn người dùng"
                        margin="normal"
                        placeholder="Type to search users"
                      />
                    )}
                    fullWidth
                    disablePortal
                    blurOnSelect
                  />
                ) : (
                  <TextField
                    label="Người Dùng"
                    fullWidth
                    value={event?.title ? event.title : username}
                    disabled
                    margin="normal"
                  />
                )}
              </Box>

              <FormControl
                fullWidth
                margin="normal"
                disabled={isAdmin && !!event}
              >
                <InputLabel id="reason-select-label">Lý do</InputLabel>
                <Select
                  labelId="reason-select-label"
                  value={event?.desc ? event.desc : (eventReason?.value || '')}
                  label="Lý do"
                  onChange={(e) => {
                    const exist = reasonOptions.find(
                      (reason) => reason.value === e.target.value
                    );
                    if (exist) {
                      setEventReason(exist);
                    }
                  }}
                >
                  {reasonOptions.map((reason) => (
                    <MenuItem key={reason.value} value={reason.value}>
                      {reason.value}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Box sx={{ mt: 2 }}>
                <Typography variant="body2">
                  Ngày:{" "}
                  {event?.start
                    ? moment(event.start).format("DD MMMM, YYYY")
                    : selectedSlot &&
                      moment(selectedSlot.start).format("DD MMMM, YYYY")}
                </Typography>
                <Typography variant="body2">
                  Thời gian:{" "}
                  {event?.end
                    ? timing(event.start, event.end)
                    : selectedSlot &&
                      timing(selectedSlot.start, selectedSlot.end)}
                </Typography>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Hủy</Button>
              {isAdmin && event ? (
                <Button
                  onClick={deletedEvent}
                  variant="contained"
                  color="error"
                >
                  Xóa
                </Button>
              ) : (
                <Button
                  onClick={handleCreateEvent}
                  variant="contained"
                  color="primary"
                  disabled={!eventReason}
                >
                  Xác nhận
                </Button>
              )}
            </DialogActions>
          </Dialog>
        </Paper>
      </Box>
    </>
  );
};

export default CalendarView;
