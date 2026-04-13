import React, { useState, useEffect } from 'react'
import Card from '../components/Card'
import Table from '../components/Table'

const ResourcesPage = () => {
  const [resources, setResources] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('ALL')

  useEffect(() => {
    // Simulate fetching resources
    const mockResources = [
      {
        id: '1',
        name: 'Computer Lab A',
        type: 'LAB',
        location: 'Building A, Floor 2',
        capacity: 30,
        available: true,
        description: 'Modern computer lab with 30 workstations'
      },
      {
        id: '2',
        name: 'Conference Room 101',
        type: 'HALL',
        location: 'Building B, Floor 1',
        capacity: 50,
        available: true,
        description: 'Large conference room with projector'
      },
      {
        id: '3',
        name: 'Classroom C203',
        type: 'CLASSROOM',
        location: 'Building C, Floor 2',
        capacity: 40,
        available: false,
        description: 'Standard classroom with whiteboard'
      },
      {
        id: '4',
        name: 'Physics Lab',
        type: 'LAB',
        location: 'Science Building, Floor 3',
        capacity: 25,
        available: true,
        description: 'Fully equipped physics laboratory'
      },
      {
        id: '5',
        name: 'Study Room 1',
        type: 'CLASSROOM',
        location: 'Library, Floor 2',
        capacity: 6,
        available: true,
        description: 'Small group study room'
      }
    ]
    setResources(mockResources)
  }, [])

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'ALL' || resource.type === filterType
    return matchesSearch && matchesType
  })

  const getStatusColor = (available) => {
    return available ? 'text-green-400' : 'text-red-400'
  }

  const getStatusText = (available) => {
    return available ? 'Available' : 'Occupied'
  }

  const tableHeaders = ['Name', 'Type', 'Location', 'Capacity', 'Status', 'Action']

  const tableData = filteredResources.map(resource => [
    resource.name,
    resource.type,
    resource.location,
    resource.capacity.toString(),
    <span className={getStatusColor(resource.available)}>
      {getStatusText(resource.available)}
    </span>,
    <button 
      className="btn-primary text-sm px-3 py-1"
      disabled={!resource.available}
    >
      Book Now
    </button>
  ])

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-6">Resource Management</h1>
        
        {/* Search and Filter Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 bg-dark-surface border border-dark-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent-cyan"
            />
          </div>
          <div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 bg-dark-surface border border-dark-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent-cyan"
            >
              <option value="ALL">All Types</option>
              <option value="CLASSROOM">Classrooms</option>
              <option value="LAB">Labs</option>
              <option value="HALL">Halls</option>
            </select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{resources.length}</div>
              <div className="text-gray-400 text-sm">Total Resources</div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {resources.filter(r => r.available).length}
              </div>
              <div className="text-gray-400 text-sm">Available Now</div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">
                {resources.filter(r => !r.available).length}
              </div>
              <div className="text-gray-400 text-sm">Occupied</div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">
                {Math.floor(resources.reduce((sum, r) => sum + r.capacity, 0) / resources.length)}
              </div>
              <div className="text-gray-400 text-sm">Avg Capacity</div>
            </div>
          </Card>
        </div>
      </div>

      {/* Resources Table */}
      <Card>
        <h2 className="text-xl font-semibold mb-4">Available Resources</h2>
        <Table
          headers={tableHeaders}
          data={tableData}
        />
      </Card>
    </div>
  )
}

export default ResourcesPage
