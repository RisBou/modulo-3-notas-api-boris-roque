export default class AuthController {
  constructor({ authService }) {
    this.authService = authService;
  }

  register = async (req, res) => {
    try {
      const data = req.body;

      console.log("Esto estoy mandando:", data);

      if (!data.email || !data.password) {
        return res.status(400).json({
          success: false,
          code: 400,
          message: "Email y password son obligatorios",
        });
      }

      const result = await this.authService.register(data);

      return res.status(201).json({
        success: true,
        code: 201,
        message: "Usuario registrado correctamente",
        data: result,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        code: 400,
        message: error.message,
      });
    }
  };

  login = async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          code: 400,
          message: "Email y password son obligatorios",
        });
      }

      const result = await this.authService.login(req.body);

      return res.status(200).json({
        success: true,
        code: 200,
        message: "Login exitoso",
        data: result,
      });
    } catch (error) {
      let status = 500;

      // Ajusta esto según cómo manejes errores en tu servicio
      if (error.message.includes("Invalid")) status = 401;
      else if (error.message.includes("not found")) status = 404;

      return res.status(status).json({
        success: false,
        code: status,
        message: error.message,
      });
    }
  };
}
