import { useNavigate } from "react-router-dom"
import { useEffect } from "react"

export default function EstagiosPipeline() {
  const navigate = useNavigate()

  useEffect(() => {
    // Redireciona para o kanban já que as configurações foram movidas para lá
    navigate("/kanban")
  }, [navigate])

  return null
}