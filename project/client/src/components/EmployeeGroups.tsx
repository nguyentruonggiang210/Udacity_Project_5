import { History } from 'history'
import * as React from 'react'
import {
  Button,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

import { createEmployeeGroup, deleteEmployeeGroup, getEmployeeGroups, patchEmployeeGroup } from '../api/employee-groups-api'
import Auth from '../auth/Auth'
import { EmployeeGroup } from '../types/EmployeeGroup'

interface EmployeeGroupsProps {
  auth: Auth
  history: History
}

interface EmployeeGroupsState {
  employeeGroups: EmployeeGroup[]
  newEmployeeGroupName: string
  newDescription: string
  loadingEmployeeGroups: boolean
}

export class EmployeeGroups extends React.PureComponent<EmployeeGroupsProps, EmployeeGroupsState> {
  state: EmployeeGroupsState = {
    employeeGroups: [],
    newEmployeeGroupName: '',
    newDescription: '',
    loadingEmployeeGroups: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newEmployeeGroupName: event.target.value })
  }

  handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newDescription: event.target.value })
  }

  onEditButtonClick = (employeeGroupId: string) => {
    this.props.history.push(`/employeeGroups/${employeeGroupId}/edit`)
  }

  onEmployeeGroupCreate = async () => {
    try {
      const newEmployeeGroup = await createEmployeeGroup(this.props.auth.getIdToken(), {
        name: this.state.newEmployeeGroupName,
        description: this.state.newDescription
      })
      console.log(newEmployeeGroup)
      this.setState({
        employeeGroups: [...this.state.employeeGroups, newEmployeeGroup],
        newEmployeeGroupName: ''
      })
    } catch {
      alert('EmployeeGroup creation failed')
    }
  }

  onEmployeeGroupDelete = async (employeeGroupId: string) => {
    try {
      await deleteEmployeeGroup(this.props.auth.getIdToken(), employeeGroupId)
      this.setState({
        employeeGroups: this.state.employeeGroups.filter(employeeGroup => employeeGroup.employeeGroupId !== employeeGroupId)
      })
    } catch {
      alert('EmployeeGroup deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const employeeGroups = await getEmployeeGroups(this.props.auth.getIdToken())
      console.log()
      this.setState({
        employeeGroups,
        loadingEmployeeGroups: false
      })
    } catch (e) {
      alert(`Failed to fetch employeeGroups: ${(e as Error).message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">EMPLOYEE GROUPS</Header>

        {this.renderCreateEmployeeGroupInput()}
        {this.renderHeader()}
        {this.renderEmployeeGroups()}
      </div>
    )
  }

  renderCreateEmployeeGroupInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16} style={{ marginBottom: 10 }}>
          <Input
            fluid
            placeholder="Employee name"
            onChange={this.handleNameChange}
          />

        </Grid.Column>
        <Grid.Column width={16} style={{ marginBottom: 10 }}>
          <Input
            fluid
            placeholder="Employee description"
            onChange={this.handleDescriptionChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Button color='blue' onClick={() => this.onEmployeeGroupCreate()}>
            CREATE
          </Button>
        </Grid.Column>

        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderHeader() {
    return (
      <Grid padded>
      <Grid.Row>
        <Grid.Column width={3} style={{ marginRight: 13 }}>
          <Header as="h4">Name</Header>
        </Grid.Column>
        <Grid.Column width={3} style={{ marginRight: 13 }}>
          <Header as="h4">Description</Header>
        </Grid.Column>
        <Grid.Column width={4} style={{ marginRight: 13 }}>
          <Header as="h4">Image</Header>
        </Grid.Column>
        <Grid.Column width={3} style={{ marginRight: 16 }}>
          <Header as="h4">Date</Header>
        </Grid.Column>
        <Grid.Column width={2}>
          <Header as="h4">Action</Header>
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
      </Grid>
    )
  }

  renderEmployeeGroups() {
    if (this.state.loadingEmployeeGroups) {
      return this.renderLoading()
    }

    return this.renderEmployeeGroupsList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading EMPLOYEEGROUP's
        </Loader>
      </Grid.Row>
    )
  }

  renderEmployeeGroupsList() {
    return (
      <Grid padded>
        {this.state.employeeGroups.map((employeeGroup, pos) => {
          return (
            <Grid.Row key={employeeGroup.employeeGroupId}>
              <Grid.Column width={3} verticalAlign="top">
                <h5>{employeeGroup.name}</h5>
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {employeeGroup.description}
              </Grid.Column>
              <Grid.Column width={4} floated="right">
                {employeeGroup.attachmentUrl && (
                  <Image src={employeeGroup.attachmentUrl} onError={(event: { target: { style: { display: string } } }) => event.target.style.display = 'none'} alt=" This is employee image!" size="small" wrapped />
                )}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {employeeGroup.createdAt}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(employeeGroup.employeeGroupId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onEmployeeGroupDelete(employeeGroup.employeeGroupId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }
}
