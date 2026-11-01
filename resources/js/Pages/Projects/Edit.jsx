import ManagementLayout from '../../Layouts/ManagementLayout';
import ProjectForm from '../../Components/ProjectForm';

export default function Edit({ project }) {
    return <ManagementLayout title="Edit project"><ProjectForm key={project.id} project={project} /></ManagementLayout>;
}
