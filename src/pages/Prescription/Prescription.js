import config from "../../config/config.json";
import React, { useEffect, useState } from 'react'
import getPrescriptionById from '../../api/Prescription_Api/getPrescriptionById'
// import getGeneralInstruction from '../../api/Prescription_Api/getGeneralInstruction'

import DescriptionModal from "../../component/Modal/InstructionModal/DescriptionModal";
import "./prescription.css"
import updateExerciseTrack from "../../api/Exercise_Api/updateExerciseTrack";
import { format } from "date-fns";
import YouTube from 'react-youtube';
import doctorById from "../../api/Doctor_Api/getDoctorById";
import getGeneralInstruction from "../../api/Instruction_Api/getGeneralInstruction";
import GeneralInstModal from "../../component/Modal/InstructionModal/GeneralInstModal";

export default function Prescription() {
    const [isLoading, setisLoading] = useState(true)
    const [prescriptionData, setprescriptionData] = useState([])
    const [adjunctData, setadjunctData] = useState([])
    const [patientData, setpatientData] = useState({})
    const [exerciseData, setexerciseData] = useState([])
    const [descriptionModalData, setdescriptionModalData] = useState([])
    const [descriptionLang, setdescriptionLang] = useState("")
    const [showDescriptionModal, setshowDescriptionModal] = useState(false)
    const [adviceData, setadviceData] = useState([])
    const [scaleObj, setscaleObj] = useState({ scale_link: "" })
    const [doctorObj, setdoctorObj] = useState("")
    const [generalInst, setgeneralInst] = useState()
    const [showGeneralInstModal, setshowGeneralInstModal] = useState(false)
    const [isMobile, setisMobile] = useState(false)

    useEffect(() => {
        const windowWidth=window.screen.availWidth
        if(windowWidth<=468){
            setisMobile(true)
        }
    }, [window.screen.availWidth])
    

    useEffect(() => {
        async function fetchData() {
            setisLoading(true)
            const url = new URL(window.location.href);
            
            let params = new URLSearchParams(url.search)
            // console.log("params", parseInt(params.get("prescription_id"), 10));
            let prescription = await getPrescriptionById({ id: parseInt(params.get("prescription_id")) })
            let requestBody = {
                type: "exercise",
                instruction_id: config.general_inst_id
            }
            let generalInstResp = await getGeneralInstruction(requestBody)
            if (generalInstResp.status) {
                
                viewGeneralInstModal(generalInstResp.data[0])
            }
            console.log("generalInstResp", generalInstResp);

            console.log("prescription", prescription.data[0]);
            if (prescription.status) {
                setprescriptionData(prescription.data[0])
                if (prescription.data[0].doctor_id) {
                    let doctorObject = await doctorById({ doctor_id: prescription.data[0].doctor_id })
                    // console.log("doctorObject", doctorObject.data);
                    setdoctorObj(doctorObject.data)
                }
                if (prescription.data[0].adjunct) {
                    let adjunct = JSON.parse(prescription.data[0].adjunct)
                    let adjunctArr = Object.values(adjunct);
                    // console.log("adjunctArr", parseInt(adjunctArr[0].adjunct_time));
                    setadjunctData(adjunctArr)
                }
                if (prescription.data[0].doctor_advice) {
                    let advice = JSON.parse(prescription.data[0].doctor_advice)
                    let adviceArr = Object.values(advice);
                    setadviceData(adviceArr)
                }
                if (prescription.data[0].exercise_arr) {
                    let exercise = JSON.parse(prescription.data[0].exercise_arr)
                    let exerciseArr = Object.values(exercise);
                    console.log("exerciseArr", exerciseArr);
                    setexerciseData(exerciseArr)
                }

                if (prescription.data[0].scales_obj) {
                    let scaleObject = JSON.parse(prescription.data[0].scales_obj)

                    if (scaleObject.ScaleDays.includes(",")) {
                        let daysArr = scaleObject.ScaleDays.split(",")
                        let dayStr = daysArr.join(" & ")
                        scaleObject.ScaleDays = dayStr
                    }

                    console.log("scaleObject", scaleObject)
                    setscaleObj(scaleObject)
                }

                if (prescription.data[0].patient_obj) {
                    let patientObj = JSON.parse(prescription.data[0].patient_obj)
                    setpatientData(patientObj)
                }

            }

            setisLoading(false)
        }
        fetchData();
    }, [])


    const convertDescObj = async (instObj) => {
        let instData = JSON.parse(instObj)
        return Object.values(instData)
    }
    async function viewDescriptionModal(instObj, language) {
        if (instObj) {
            let descriptionData = await convertDescObj(instObj)
            setdescriptionModalData(descriptionData)
        } else {
            setdescriptionModalData([])
        }
        setdescriptionLang(language)
        setshowDescriptionModal(true)

    }

    async function viewGeneralInstModal(instObj) {
        
        instObj.descriptionEnglish = await convertDescObj(instObj.instruction_description_english)
            
        instObj.descriptionHindi = await convertDescObj(instObj.instruction_description_hindi)
        
        setgeneralInst(instObj)
        setshowGeneralInstModal(true)
    }

    async function updateExercise(exe, index) {
        if (!exerciseData[index].isCompleted) {
            // console.log("i am heree", exerciseData[index], exe);
            const url = new URL(window.location.href);
            let params = new URLSearchParams(url.search)
            let ExerciseTrackReq = {
                prescription_id: parseInt(params.get("prescription_id")),
                exercise_name: exe.exercise_name,
                exercise_date: format(new Date(), "yyyy-MM-dd")
            }
            setexerciseData((exerciseData) => {
                exerciseData[index].isCompleted = 1
                return [...exerciseData]
            })
            updateExerciseTrack(ExerciseTrackReq)
        }
        else {
            return true
        }
    }

    async function toggleVideoDemo(exe, index) {
        setexerciseData((exerciseData) => {
            if (!exerciseData[index].showVideo) {
                exerciseData[index].showVideo = true
            } else {
                exerciseData[index].showVideo = false
            }
            return [...exerciseData]
        })
    }

    function onPlayerReady(event) {
        console.log("event target", event.target);
        event.target.mute();
        event.target.playVideo();
    }



    return (
        <>
            {prescriptionData && doctorObj ?
                <>
                    {/* Description Modal */}
                    {showDescriptionModal &&
                        <DescriptionModal
                            descriptionLang={descriptionLang}
                            descriptionModalData={descriptionModalData}
                            setshowDescriptionModal={setshowDescriptionModal}
                            showDescriptionModal={showDescriptionModal}
                        />
                    }
                    {/* Description Modal */}
                    {showGeneralInstModal &&
                        <GeneralInstModal
                        isMobile={isMobile}
                            descriptionLang={"English"}
                            descriptionEnglish={generalInst.descriptionEnglish}
                            descriptionHindi={generalInst.descriptionHindi}
                            setshowGeneralInstModal={setshowGeneralInstModal}
                            showGeneralInstModal={showGeneralInstModal}
                        />
                    }
                    <div className='emailTemplate'>
                        <div className="poweredText">
                            <h5 id="poweredText">Powered By WorkFitt</h5>
                        </div>
                        <div class="flexClass templateHead">
                            <img src={config.backend_url + doctorObj.doctor_logo} id="doctor_logo" />
                            <div className="seprator" style={{ "color": "#665e5e" }}></div>
                            <div className="doctor_details">
                                <h1 className="doctor_name_top">{prescriptionData.doctor_name}</h1>
                                <p>{prescriptionData.doctor_address}</p>
                                <p>Cell: {prescriptionData.doctor_mobile} </p>
                                <p>Email: {prescriptionData.doctor_email}</p>
                            </div>
                        </div>
                        <div class="prescriptionBody">
                            <div class="bodyElement">
                                <p><b>Name</b> - {patientData.patient_name}</p>
                                <p><b>Age</b> - {patientData.patient_age}</p>
                                <p><b>Gender</b> - {patientData.patient_gender}</p>
                                <p><b>C/O </b>- {prescriptionData.prescription_c_o}</p>
                            </div>

                            {adviceData && adviceData.length > 0 ?
                                <div class="bodyElement">
                                    <div class="adjunct">
                                        <p><b>Advice</b> -</p>
                                        <ul>
                                            {adviceData.map((advice, key) => {
                                                return (
                                                    <li class="adjunct_li" key={key}>
                                                        <div className="liElement">{key + 1}{".  "}{advice}</div>
                                                    </li>
                                                )
                                            }
                                            )}
                                        </ul>
                                    </div>
                                </div>
                                :
                                null
                            }
                            {prescriptionData.instruction_note ?
                                <div class="bodyElement">
                                    <p><b>Instructions</b> - {prescriptionData.instruction_note}</p>
                                </div>
                                :
                                null
                            }
                            {prescriptionData.doctor_note ?
                                <div class="bodyElement">
                                    <p><b>Doctor Note</b> - {prescriptionData.doctor_note}</p>
                                </div>
                                :
                                null
                            }

                            {adjunctData && adjunctData.length > 0 ?
                                <div class="bodyElement">
                                    <div class="adjunct">
                                        <p><b>Adjunct</b> -</p>
                                        <ul>
                                            {adjunctData.map((adj, key) => {
                                                return (
                                                    <li class="adjunct_li flexClass" key={key}> <div className="liElement">{key + 1}{".  "}{adj.adjunct_name} {adj.adjunct_time && parseInt(adj.adjunct_time) ? " - " + adj.adjunct_time : ""}{" "}</div>
                                                        <div className="liElement">
                                                            <span className="instructionSpace" onClick={() => { viewDescriptionModal(adj.instruction_description_english, "English") }}>[Instruction English]</span>{" "}
                                                            <span className="instructionSpace" onClick={() => { viewDescriptionModal(adj.instruction_description_hindi, "Hindi") }}>[Instruction Hindi]</span>
                                                        </div>
                                                    </li>
                                                )
                                            }

                                            )}
                                        </ul>
                                    </div>
                                </div>
                                : null}

                            <div class="bodyElement">
                                <h2 id="exerciseHead">Exercise Prescription</h2>
                                {exerciseData.map((exercise, key) => {
                                 {/* console.log("exercise", exercise)  */}
                                    let audioPath = config.backend_url + exercise.audioFilePath
                                    {/* audioPath = "/akshaynarkar31@gmail_com_push-ups_June_25_2022_audio.mp3" */ }

                                    return (
                                        <div className="exercise" key={key}>
                                            {exercise.showVideo ?
                                                <>
                                                    {/* <div className="exercise_video" dangerouslySetInnerHTML={{ __html: exercise.videoObj.video_iframe }} style={{ position: "relative" }}></div> */}
                                                    <YouTube
                                                        videoId={exercise.videoObj.video_youtube_id}
                                                        className="exercise_video"
                                                        style={{ position: "relative" }}
                                                        opts={{
                                                            "height": '175',
                                                            "width": '301',
                                                            "playerVars": {
                                                                // https://developers.google.com/youtube/player_parameters
                                                                "autoplay": 1,
                                                                "loop": 1,
                                                                "controls": 0,
                                                                "disablekb": 1,
                                                                "modestbranding": 1,
                                                                "playsinline": 1,
                                                                "rel": 0
                                                            },
                                                        }}
                                                        onReady={(e) => { onPlayerReady(e) }}
                                                        onEnd={(e) => { e.target.playVideo(); }}
                                                    />
                                                </>
                                                : null
                                            }
                                            <div className="flexClass exercise_heading">
                                                <h5> {key + 1}{") "} {exercise.exercise_name}</h5> {" "}
                                                <div className="instContainer">
                                                    <span className="instructionSpace" onClick={() => { toggleVideoDemo(exercise, key) }}>[Demo Movement]</span> {" "}
                                                    <span className="instructionSpace" onClick={() => { viewDescriptionModal(exercise.instructionObj.instruction_description_english, "English") }}>[Instruction English]</span> {" "}
                                                    <span className="instructionSpace" onClick={() => { viewDescriptionModal(exercise.instructionObj.instruction_description_hindi, "Hindi") }}>[Instruction Hindi]</span>
                                                </div>
                                            </div>
                                            <div><b>{exercise.exercise_reps ? `${exercise.exercise_reps} Reps ` : ""} {exercise.exercise_holds ? `x ${exercise.exercise_holds} Holds ` : ""} {exercise.exercise_rests ? `x ${exercise.exercise_rests} Rests ` : ""} {exercise.exercise_sets ? `x ${exercise.exercise_sets} Sets ` : ""} {exercise.exercise_time ? `x ${exercise.exercise_time} Seconds ` : ""}</b></div>
                                            <audio controls onPlay={() => { updateExercise(exercise, key) }}>
                                                <source src={audioPath} type="audio/mp3" />
                                            </audio>
                                            {exercise.exercise_note ?
                                                <p><b>Special Note : </b>{exercise.exercise_note}</p>
                                                : null}
                                        </div>
                                    )
                                })}

                            </div>
                            {scaleObj && scaleObj.scale_link ?
                                <div class="bodyElement">
                                    <p>{`Please Fill Out The form available on the link below after ${scaleObj.ScaleDays} days and send the reports to the
                                therapist. Thankyou`}</p>
                                    <a href={scaleObj.scale_link} target="_blank"> {scaleObj.scale_link}</a>
                                </div>
                                : null
                            }

                            <div class="footer">
                                <div></div>
                                <div>
                                    <img src={config.backend_url + doctorObj.doctor_sign} alt="Sign" id="sign" />
                                    <h3 id="doctorName">{prescriptionData.doctor_name}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
                : null
            }
        </>
    )
}
