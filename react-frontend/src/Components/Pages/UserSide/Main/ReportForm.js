import React from "react";
import UserNavbar from "./../Nav/UserNavbar";
import { Container, Col, Row, Form} from "react-bootstrap";
import emailjs from "emailjs-com"
import "./../../../../Assets/Styles/Main.css"
import notification from "./../../../Alerts"


export default function ReportForm() {

    //function for sending the report form
  const sendReport = (e) => {
    //prevents form from submitting when rendered
    e.preventDefault();

    //email js library used to send forms to emails.
    //the ids below were provided when creating an account with emailjs
    emailjs.sendForm('service_9k8kd99', 'template_4i0yslv', e.target, 'user_q0y6m0IkmgAmm2kSEjneL')
    //returns results and a success message
      .then((result) => {
        notification("success", "Success", "Issue has been submitted!");
          console.log(result.text);
          //returns an error message
      }, (error) => {
          notification("error", "Error", "Fill out all fields!")
          console.log(error.text);
      });
      //resets the form
      e.target.reset()
    }
  
  return (
    <>
    <UserNavbar/>
    <div className="top"/>
        <Container>
          <Row>
            <Col lg={3} md={3} xs={0}></Col>
            <Col lg={6} md={6} xs={12} className='form-bg' >
              <Form className="form-edit"onSubmit={sendReport}>
                <h3>Report an issue</h3>
                <Form.Group>
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Enter Username'
                    name='username'
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Enter email'
                    name='email'
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Subject</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Enter Report Subject'
                    name='subject'
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Message</Form.Label>
                  <Form.Control
                    as='textarea'
                    placeholder='Enter Issue'
                    name='message'
                  />
                </Form.Group>
                <button className="btn-view">
                  Report Issue
                </button>
              </Form>
            </Col>
          </Row>
        </Container>
      </>
  );
};

