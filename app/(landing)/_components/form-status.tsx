interface FormStatusProps {
    message? : string
}

export default function FormStatus ({message} : FormStatusProps) {
    return  (
        <div>{message}</div>
    )
}