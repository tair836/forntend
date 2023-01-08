


export type Student = {
    id: String,
    name: String,
    image: String,
}


const students: Array<Student> = [
    {
        id: '1',
        name: 'Eliav',
        image: '',
    },
    {
        id: '2',
        name: 'Eliav',
        image: '',
    },
    {
        id: '3',
        name: 'Eliav',
        image: '',
    },
    {
        id: '4',
        name: 'Eliav',
        image: '',
    },
    {
        id: '5',
        name: 'Eliav',
        image: '',
    },
    {
        id: '6',
        name: 'Eliav',
        image: '',
    },
    {
        id: '7',
        name: 'Eliav',
        image: '',
    }
]


const getAllStudents = () => {
    return students
}

const addStudent = (student: Student) => {
    students.push(student)
}

export default { getAllStudents, addStudent }