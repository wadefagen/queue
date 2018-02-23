import React from 'react'
import {
  Card,
  CardBody,
  CardTitle,
  CardSubtitle,
} from 'reactstrap'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faMapMarker from '@fortawesome/fontawesome-free-solid/faMapMarker'
import faQuestion from '@fortawesome/fontawesome-free-solid/faQuestionCircle'

const QueueCard = ({ queue, ...rest }) => {
  const { name: queueName, location, questionCount } = queue
  return (
    <Card className="mb-3 queue-card" {...rest}>
      <CardBody>
        <CardTitle>CS 225</CardTitle>
        <CardSubtitle className="mb-2">Another queue name</CardSubtitle>
        <div className="text-muted">
          <FontAwesomeIcon icon={faMapMarker} fixedWidth className="mr-2" />
          Siebel Basement
          <br />
          <FontAwesomeIcon icon={faQuestion} fixedWidth className="mr-2" />
          2 Questions
        </div>
      </CardBody>
      <style global jsx>{`
        .queue-card {
          transition: all 200ms;
          cursor: pointer;
        }
        .queue-card:hover {
          transform: translateY(-1px);
          box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12);
        }
      `}</style>
    </Card>
  )
}

export default QueueCard