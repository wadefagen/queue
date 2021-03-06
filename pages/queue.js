import React from 'react'
import PropTypes from 'prop-types'
import {
  Container,
  Row,
  Col,
} from 'reactstrap'
import withRedux from 'next-redux-wrapper'
import Error from 'next/error'

import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faSpinner from '@fortawesome/fontawesome-free-solid/faSpinner'

import makeStore from '../redux/makeStore'
import { fetchQueue, fetchQueueRequest } from '../actions/queue'
import { connectToQueue, disconnectFromQueue } from '../socket/client'

import PageWithUser from '../components/PageWithUser'
import Loading from '../components/Loading'
import Layout from '../components/Layout'
import StaffSidebar from '../components/StaffSidebar'
import QuestionPanel from '../components/QuestionPanel'
import QuestionListContainer from '../containers/QuestionListContainer'
import ShowForCourseStaff from '../components/ShowForCourseStaff'
import QuestionNotificationsToggle from '../components/QuestionNotificationsToggle'


class Queue extends React.Component {
  static getInitialProps({ isServer, store, query }) {
    const queueId = Number.parseInt(query.id, 10)
    if (isServer) {
      store.dispatch(fetchQueueRequest(queueId))
    }
    return {
      queueId,
      isFetching: isServer,
    }
  }

  componentDidMount() {
    this.props.fetchQueue(this.props.queueId)
  }

  componentDidUpdate(prevProps) {
    if ((prevProps.isFetching && !this.props.isFetching) && this.props.hasQueue) {
      // We have finished fetching the queue and the queue exists (was not a 404)
      // It's now safe to connect to the websocket
      connectToQueue(this.props.dispatch, this.props.queueId)
    }
  }

  componentWillUnmount() {
    disconnectFromQueue(this.props.queueId)
  }

  render() {
    const { isFetching, hasQueue } = this.props
    if (isFetching) {
      return <Loading />
    }
    if (!isFetching && !hasQueue) {
      return <Error statusCode={404} />
    }
    return (
      <Layout>
        <Container fluid>
          <Row>
            <Col xs={{ size: 12 }} md={{ size: 4 }} lg={{ size: 3 }} className="mb-3 mb-md-0">
              <ShowForCourseStaff queueId={this.props.queueId}>
                <QuestionNotificationsToggle />
              </ShowForCourseStaff>
              <StaffSidebar queueId={this.props.queueId} />
            </Col>
            <Col xs={{ size: 12 }} md={{ size: 8 }} lg={{ size: 9 }}>
              <QuestionPanel queueId={this.props.queueId} />
              <QuestionListContainer queueId={this.props.queueId} />
            </Col>
          </Row>
        </Container>
      </Layout>
    )
  }
}

Queue.propTypes = {
  isFetching: PropTypes.bool.isRequired,
  hasQueue: PropTypes.bool.isRequired,
  fetchQueue: PropTypes.func.isRequired,
  queueId: PropTypes.number.isRequired,
  dispatch: PropTypes.func.isRequired,
}

const mapStateToProps = (state, ownProps) => ({
  isFetching: state.queues.isFetching,
  hasQueue: !!state.queues.queues[ownProps.queueId],
})

const mapDispatchToProps = dispatch => ({
  fetchQueue: queueId => dispatch(fetchQueue(queueId)),
  dispatch,
})

export default withRedux(makeStore, mapStateToProps, mapDispatchToProps)(PageWithUser(Queue))
