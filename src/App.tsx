import React from "react";
import "./App.css";

import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import { Autocomplete, Checkbox, Chip, Fab, FormControlLabel, Grid, InputAdornment, Switch, TextField } from "@mui/material";
import { AccountCircle, EmailOutlined, LocationOn, ResetTvOutlined } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import Logo from "./assets/logo_wirbesetzen.png";
import Background from "./assets/bg.jpg";
import { top100Films } from "./assets/data";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import WorkHistoryRoundedIcon from "@mui/icons-material/WorkHistoryRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import StarsRoundedIcon from "@mui/icons-material/StarsRounded";
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import { green } from "@mui/material/colors";
import CheckIcon from "@mui/icons-material/Check";
import CircularProgress from "@mui/material/CircularProgress";

import { ICvModel } from "./CvModel";
import { Applicant, IDigiCVResponse } from "./GetDigiCvModel";
import { useParams } from "react-router-dom";
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";
import Alert from "@mui/material/Alert";

interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window?: () => Window;
}
function App(props: Props) {
  const { window } = props;
  const { identifier, mode } = useParams();
  const URL = `https://prod-77.westeurope.logic.azure.com/workflows/1044106e7c36473eafd76e003b78cc9b/triggers/manual/paths/invoke/digicvs/${identifier}/action/${mode}?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=S3l4GKkJ8Cl-qHFRdesMQ037BTQbLqUFk-avlezeig0`;
  const [digiCvResponse, setDigiCvResponse] = React.useState<IDigiCVResponse>();

  const [mobileOpen, setMobileOpen] = React.useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const timer = React.useRef<ReturnType<typeof setTimeout>>();
  const [ready, setReady] = React.useState(false);
  const [error, setError] = React.useState(false);

  const buttonSx = {
    ...(success && {
      bgcolor: green[500],
      "&:hover": {
        bgcolor: green[700],
      },
    }),
  };

  const [state, setState] = React.useState<ICvModel>({
    address: "",
    eduction: [],
    email: "",
    jobHistory: [],
    jobTitle: "",
    name: "",
    courses: [],
    description: "",
    experiance: [],
  });

  React.useEffect(() => {
    fetch(URL, { method: "post" }).then((e) => {
      if (mode == "getcv") {
        e.json().then((result: IDigiCVResponse) => {
          setDigiCvResponse(result);
          setState({
            address: result.digicv.address,
            courses: result.digicv.courses,
            eduction: result.digicv.eduction,
            email: result.applicant.email,
            experiance: [...result.digicv.experiance.split(",")],
            jobHistory: result.digicv.jobHistory,
            jobTitle: result.applicant.branche.name,
            name: result.applicant.name,
            description: result.digicv.description,
            logo: result.customer.logo_path,
            customer: result.customer,
          });
        });
      }
      if (mode == "create") {
        e.json().then((result: IDigiCVResponse) => {
          setState({
            address: "",
            courses: [{ name: "", description: "" }],
            eduction: [{ from: "", to: "", name: "", title: "" }],
            email: result.applicant.email,
            experiance: [],
            jobHistory: [{ from: "", to: "", name: "", title: "" }],
            name: result.applicant.name,
            jobTitle: result.applicant.branche.name,
            customer: result.customer,
            logo: result.customer.logo_path,
            applicant: identifier,
          });
        });
      }
      setReady(true);
    });

    return () => {
      clearTimeout(timer.current);
    };
  }, [identifier, mode]);

  const handleCreateCv = () => {
    const URL_CREATE = `https://prod-77.westeurope.logic.azure.com/workflows/1044106e7c36473eafd76e003b78cc9b/triggers/manual/paths/invoke/digicvs/${identifier}/action/createcv?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=S3l4GKkJ8Cl-qHFRdesMQ037BTQbLqUFk-avlezeig0`;
    console.log(state);
    return fetch(URL_CREATE, { method: "post", body: JSON.stringify(state) });
  };

  const handleButtonClick = () => {
    if (!loading && !state.sent) {
      setSuccess(false);
      setLoading(true);
      handleCreateCv().then((resp) => {
        resp.json().then(console.log);
        if (resp.ok) {
          timer.current = setTimeout(() => {
            setSuccess(true);
            setLoading(false);
            setState((e) => (e = { ...e, sent: true }));
          }, 2000);
        } else {
          setError(true);
        }
      });
    }
  };

  const navItems = ["Home", "About", "Contact"];

  const theme = createTheme({
    palette: {
      primary: {
        main: state.customer?.theme.themePrimary || "#0052cc",
      },
      secondary: {
        main: state.customer?.theme.themeSecondary || "#edf2ff",
      },
    },
  });
  if (ready)
    return (
      <>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Container style={{ backgroundColor: "#f1f1f1" }} maxWidth="md">
            <Box sx={{ bgcolor: "#fff", height: "100%" }}>
              <AppBar style={{ backgroundColor: state.customer?.theme.themePrimary }} component="nav">
                <Toolbar>
                  <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, display: { sm: "none" } }}></IconButton>
                  <Typography variant="h6" component="div" sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }} style={{ color: "#fff" }}>
                    <b>Digi-CV </b>| Ihr digitaler Lebenslauf
                  </Typography>
                  <Box sx={{ display: { xs: "none", sm: "block" } }}>
                    {navItems.map((item) => (
                      <Button key={item} sx={{ color: "#fff" }}>
                        {item}
                      </Button>
                    ))}
                  </Box>
                </Toolbar>
              </AppBar>
              <Toolbar />

              <Grid container padding={3}>
                <Grid xs display="flex" justifyContent="space-between" alignItems="center">
                  <div>
                    <Typography fontSize={30} fontWeight={700}>
                      Lebenslauf
                    </Typography>
                    <Typography variant="subtitle1">als {state?.jobTitle}</Typography>
                    <Typography variant="subtitle1">
                      bei <b>{state?.customer?.name}</b>
                    </Typography>
                  </div>
                  <div>
                    <img height={70} src={state.logo} alt="logo" />
                  </div>
                </Grid>
                <Grid container>
                  <Grid width={"100%"} display="flex" marginTop={3} md={12}>
                    <InfoRoundedIcon />
                    <Typography marginLeft={2} fontWeight={700}>
                      Informationen
                    </Typography>
                  </Grid>
                  <Grid width={"100%"} marginTop={3} md={4}>
                    <TextField
                      fullWidth
                      id="input-with-icon-textfield"
                      label="Vor & Nachname"
                      placeholder="Dein Name"
                      value={state?.name}
                      onChange={(ev) => setState((e) => (e = { ...e, name: ev.target.value }))}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <AccountCircle />
                          </InputAdornment>
                        ),
                      }}
                      variant="standard"
                    />
                  </Grid>
                  <Grid width={"100%"} marginTop={3} md={4}>
                    <TextField
                      fullWidth
                      id="input-with-icon-textfield"
                      label="Email Adresse"
                      placeholder="Deine Email"
                      value={state?.email}
                      onChange={(ev) => setState((e) => (e = { ...e, email: ev.target.value }))}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailOutlined />
                          </InputAdornment>
                        ),
                      }}
                      variant="standard"
                    />
                  </Grid>
                  <Grid width={"100%"} marginTop={3} md={4}>
                    <TextField
                      fullWidth
                      multiline
                      id="input-with-icon-textfield"
                      label="Anschrift"
                      placeholder="Deine Anschrift"
                      value={state?.address}
                      onChange={(ev) => setState((e) => (e = { ...e, address: ev.target.value }))}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LocationOn />
                          </InputAdornment>
                        ),
                      }}
                      variant="standard"
                    />
                  </Grid>
                  <Grid width={"100%"} md={12} marginTop={3}>
                    <TextField onChange={(ev) => setState((e) => (e = { ...e, description: ev.target.value }))} fullWidth placeholder="Du kannst darin auf Deine Berufserfahrung, Deine Branche oder Deine Kenntnisse eingehen. Viele Mitglieder erwähnen auch erfolgreiche Projekte oder Erfahrungen in früheren Jobs." id="standard-multiline-static" label="Wie würdest du dich in ein paar Worten beschreiben?" multiline rows={4} value={state?.description} variant="outlined" />
                  </Grid>
                </Grid>
                <Grid container marginTop={5}>
                  <Grid display="flex" md={12}>
                    <WorkHistoryRoundedIcon />
                    <Grid marginLeft={2}>
                      <Typography fontWeight={700}>Berufserfahrung</Typography>
                      <Typography>Wie sieht Dein Beruflicher Werdegang bisher aus:</Typography>
                    </Grid>
                  </Grid>
                  {state?.jobHistory.map((hist, i) => (
                    <Grid container>
                      <Grid width={"100%"} marginTop={4} md={2}>
                        <TextField
                          fullWidth
                          onChange={(ev) => {
                            let _state = state.jobHistory;
                            _state[i].from = ev.target.value;
                            setState((e) => (e = { ...e, jobHistory: _state }));
                          }}
                          variant="standard"
                          id="outlined-required-from"
                          label="Von"
                          defaultValue={hist.from}
                        />
                      </Grid>
                      <Grid width={"100%"} marginTop={4} md={2}>
                        <TextField
                          onChange={(ev) => {
                            let _state = state.jobHistory;
                            _state[i].to = ev.target.value;
                            setState((e) => (e = { ...e, jobHistory: _state }));
                          }}
                          variant="standard"
                          fullWidth
                          id="outlined-required-to"
                          label="Bis"
                          defaultValue={hist.to}
                        />
                      </Grid>
                      <Grid width={"100%"} marginTop={3} md={4}>
                        <TextField
                          onChange={(ev) => {
                            let _state = state.jobHistory;
                            _state[i].title = ev.target.value;
                            setState((e) => (e = { ...e, jobHistory: _state }));
                          }}
                          variant="filled"
                          fullWidth
                          id="outlined-required"
                          label="Jobtitle"
                          defaultValue={hist.title}
                        />
                      </Grid>
                      <Grid width={"100%"} marginTop={3} md={3}>
                        <TextField
                          onChange={(ev) => {
                            let _state = state.jobHistory;
                            _state[i].name = ev.target.value;
                            setState((e) => (e = { ...e, jobHistory: _state }));
                          }}
                          variant="filled"
                          fullWidth
                          id="outlined-required"
                          label="Name des Arbeitgebers"
                          defaultValue={hist.name}
                        />
                      </Grid>
                      {i <= 0 ? (
                        <Grid marginTop={3} padding={2} md={1}>
                          <Switch defaultChecked />
                        </Grid>
                      ) : i >= state.jobHistory.length - 1 ? (
                        <Grid xs style={{ marginTop: 20 }} display="flex" justifyContent="center" alignItems="center">
                          <IconButton
                            onClick={() => {
                              setState((e) => (e = { ...e, jobHistory: e.jobHistory.filter((el) => el != hist) }));
                            }}
                            aria-label="delete"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Grid>
                      ) : (
                        <></>
                      )}
                    </Grid>
                  ))}
                  {mode == "create" && (
                    <Grid style={{ marginTop: 20 }} xs display="flex" justifyContent="center" alignItems="center">
                      <Fab onClick={() => setState((e) => (e = { ...e, jobHistory: [...e.jobHistory, { active: false, from: "", name: "", title: "", to: "" }] }))} color="primary" aria-label="add">
                        <AddIcon />
                      </Fab>
                    </Grid>
                  )}
                </Grid>
                <Grid container marginTop={5}>
                  <Grid display="flex" md={12}>
                    <SchoolRoundedIcon />
                    <Grid marginLeft={2}>
                      <Typography fontWeight={700}>Ausbildung</Typography>
                      <Typography>Was sind die wichtigsten Stationen auf deinem Bildungsweg:</Typography>
                    </Grid>
                  </Grid>

                  {state?.eduction.map((hist, i) => (
                    <Grid container>
                      <Grid width={"100%"} marginTop={4} md={2}>
                        <TextField
                          fullWidth
                          onChange={(ev) => {
                            let _state = state.eduction;
                            _state[i].from = ev.target.value;
                            setState((e) => (e = { ...e, eduction: _state }));
                          }}
                          variant="standard"
                          id="outlined-required-from"
                          label="Von"
                          defaultValue={hist.from}
                        />
                      </Grid>
                      <Grid width={"100%"} marginTop={4} md={2}>
                        <TextField
                          fullWidth
                          onChange={(ev) => {
                            let _state = state.eduction;
                            _state[i].to = ev.target.value;
                            setState((e) => (e = { ...e, eduction: _state }));
                          }}
                          variant="standard"
                          id="outlined-required-to"
                          label="Bis"
                          defaultValue={hist.to}
                        />
                      </Grid>
                      <Grid width={"100%"} marginTop={3} md={4}>
                        <TextField
                          onChange={(ev) => {
                            let _state = state.eduction;
                            _state[i].title = ev.target.value;
                            setState((e) => (e = { ...e, eduction: _state }));
                          }}
                          variant="filled"
                          fullWidth
                          id="outlined-required"
                          label="Name"
                          defaultValue={hist.title}
                        />
                      </Grid>
                      <Grid width={"100%"} marginTop={3} md={3}>
                        <TextField
                          onChange={(ev) => {
                            let _state = state.eduction;
                            _state[i].name = ev.target.value;
                            setState((e) => (e = { ...e, eduction: _state }));
                          }}
                          variant="filled"
                          fullWidth
                          id="outlined-required"
                          label="Name der Ausbildung"
                          defaultValue={hist.name}
                        />
                      </Grid>
                      {i <= 0 ? (
                        <Grid marginTop={3} padding={2} md={1}></Grid>
                      ) : i >= state.jobHistory.length - 1 ? (
                        <Grid xs style={{ marginTop: 20 }} display="flex" justifyContent="center" alignItems="center">
                          <IconButton
                            onClick={() => {
                              setState((e) => (e = { ...e, eduction: e.eduction.filter((el) => el != hist) }));
                            }}
                            aria-label="delete"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Grid>
                      ) : (
                        <></>
                      )}
                    </Grid>
                  ))}
                  {mode == "create" && (
                    <Grid style={{ marginTop: 20 }} xs display="flex" justifyContent="center" alignItems="center">
                      <Fab onClick={() => setState((e) => (e = { ...e, eduction: [...e.eduction, { active: false, from: "", name: "", title: "", to: "" }] }))} color="primary" aria-label="add">
                        <AddIcon />
                      </Fab>
                    </Grid>
                  )}
                </Grid>
                <Grid container marginTop={5}>
                  <Grid display={"flex"} md={12}>
                    <StarsRoundedIcon />
                    <Grid width={"100%"} marginLeft={2}>
                      <Typography fontWeight={700}>Kentnisse</Typography>
                      <Typography>Welche fachlichen und sozialen Fähigkeiten bringst du mit:</Typography>
                    </Grid>
                  </Grid>
                  <Grid width={"100%"} marginTop={3} md={12}>
                    <Autocomplete
                      multiple
                      fullWidth
                      id="tags-filled"
                      options={top100Films.map((option) => option.title)}
                      value={state.experiance}
                      onChange={(ev, value, r, det) => setState((e) => (e = { ...e, experiance: value }))}
                      freeSolo
                      renderTags={(value: readonly string[], getTagProps) => value.map((option: string, index: number) => <Chip variant="outlined" label={option} {...getTagProps({ index })} />)}
                      renderInput={(params) => <TextField {...params} variant="outlined" label="Kentnisse" placeholder="Favorites" />}
                    />
                  </Grid>
                  <Grid container></Grid>
                </Grid>
                <Grid container marginTop={5}>
                  <Grid display="flex" md={12}>
                    <WorkspacePremiumRoundedIcon />
                    <Grid width={"100%"} marginLeft={2}>
                      <Typography fontWeight={700}>Kurse</Typography>
                      <Typography>Was waren Deine wichtigsten Kurse die du absolviert hast:</Typography>
                    </Grid>
                  </Grid>

                  {state.courses?.map((course, i) => (
                    <Grid container>
                      <Grid width={"100%"} marginTop={4} md={4}>
                        <TextField
                          onChange={(ev) => {
                            let _state = state.courses;
                            _state[i].name = ev.target.value;
                            setState((e) => (e = { ...e, courses: _state }));
                          }}
                          value={course.name}
                          fullWidth
                          variant="standard"
                          id="outlined-required"
                          label="Kurs"
                          placeholder="Name des Kurses"
                          defaultValue=""
                        />
                      </Grid>
                      <Grid width={"100%"} marginTop={3} md={7}>
                        <TextField
                          onChange={(ev) => {
                            let _state = state.courses;
                            _state[i].description = ev.target.value;
                            setState((e) => (e = { ...e, courses: _state }));
                          }}
                          value={course.description}
                          variant="filled"
                          fullWidth
                          id="outlined-required"
                          label="Beschreibung"
                          placeholder="Beschreibung des Kurses"
                          defaultValue=""
                        />
                      </Grid>
                      {i > 0 && (
                        <Grid xs style={{ marginTop: 20 }} display="flex" justifyContent="center" alignItems="center">
                          <IconButton
                            onClick={() => {
                              setState((e) => (e = { ...e, eduction: e.eduction.filter((el) => el != course) }));
                            }}
                            aria-label="delete"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Grid>
                      )}
                    </Grid>
                  ))}
                  {mode == "create" && (
                    <Grid style={{ marginTop: 20 }} xs display="flex" justifyContent="center" alignItems="center">
                      <Fab onClick={() => setState((e) => (e = { ...e, courses: [...e.courses, { name: "", description: "" }] }))} color="primary" aria-label="add">
                        <AddIcon />
                      </Fab>
                    </Grid>
                  )}
                </Grid>
                {mode == "create" && (
                  <>
                    <Grid style={{ marginTop: 20 }}>
                      <FormControlLabel onChange={(ev, value) => setState((e) => (e = { ...e, confirmed: value }))} control={<Checkbox defaultChecked={state.confirmed} />} label="Ich habe alle Angaben vollständig und wahrheitsgetreu ausgefüllt." />
                    </Grid>
                    {error && (
                      <Alert severity="error">
                        Da ist leider etwas schiefgelaufen. Möglicherweise hast du bereits einen Lebenslauf abgegeben. Ist dies nicht der Fall, melde dich bitte bei {state.customer?.email} oder unter {state.customer?.phone}
                      </Alert>
                    )}
                    <Grid xs={12} style={{ marginTop: 20 }} display="flex" justifyContent="center" alignItems="center">
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Box sx={{ m: 1, position: "relative" }}>
                          <Fab disabled={!state.confirmed} aria-label="save" color="primary" sx={buttonSx} onClick={handleButtonClick}>
                            {success ? <CheckIcon /> : <SendIcon />}
                          </Fab>
                          {loading && (
                            <CircularProgress
                              size={68}
                              sx={{
                                color: green[500],
                                position: "absolute",
                                top: -6,
                                left: -6,
                                zIndex: 1,
                              }}
                            />
                          )}
                        </Box>
                        <Box sx={{ m: 1, position: "relative" }}>
                          <Button variant="contained" sx={buttonSx} disabled={loading || !state.confirmed} onClick={handleButtonClick}>
                            {!state.sent ? "Lebenslauf versenden" : "Lebenslauf wurde versendet!"}
                          </Button>
                        </Box>
                      </Box>
                    </Grid>
                  </>
                )}
              </Grid>
            </Box>
          </Container>
        </ThemeProvider>
      </>
    );
  else {
    return (
      <>
        <svg className="ip" viewBox="0 0 256 128" width="256px" height="128px" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="grad1" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="#5ebd3e" />
              <stop offset="33%" stop-color="#ffb900" />
              <stop offset="67%" stop-color="#f78200" />
              <stop offset="100%" stop-color="#e23838" />
            </linearGradient>
            <linearGradient id="grad2" x1="1" y1="0" x2="0" y2="0">
              <stop offset="0%" stop-color="#e23838" />
              <stop offset="33%" stop-color="#973999" />
              <stop offset="67%" stop-color="#009cdf" />
              <stop offset="100%" stop-color="#5ebd3e" />
            </linearGradient>
          </defs>
          <g fill="none" stroke-linecap="round" stroke-width="16">
            <g className="ip__track" stroke="#ddd">
              <path d="M8,64s0-56,60-56,60,112,120,112,60-56,60-56" />
              <path d="M248,64s0-56-60-56-60,112-120,112S8,64,8,64" />
            </g>
            <g stroke-dasharray="180 656">
              <path className="ip__worm1" stroke="url(#grad1)" stroke-dashoffset="0" d="M8,64s0-56,60-56,60,112,120,112,60-56,60-56" />
              <path className="ip__worm2" stroke="url(#grad2)" stroke-dashoffset="358" d="M248,64s0-56-60-56-60,112-120,112S8,64,8,64" />
            </g>
          </g>
        </svg>
      </>
    );
  }
}

export default App;
