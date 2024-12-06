

export const createQuizHandler = async (req, res) => {
    try {

      const user = await User.findOne({ email }); //validate unique user
  
      if (user) {
        res.status(401).json({ message: "User already exists", success: false });
      } else {
        const hashed = await bcrypt.hash(password, 10);
        const savedUser = await User.create({
          username: username,
          password: hashed,
          email: email,
        });
        const token = jwt.sign({ username, email }, process.env.JWT_SECRET);
        res.status(200).json(new ApiResponse(200, token, "User Registered"));
      }
    } catch (err) {
      res.status(500).json({
        message: "Error signing up",
        success: false,
        error: err,
      });
    }
  };



  export const saveQuizHandler = async (req, res) => {
    try {

        

      const user = await User.findOne({ email }); //validate unique user
  
      if (user) {
        res.status(401).json({ message: "User already exists", success: false });
      } else {
        const hashed = await bcrypt.hash(password, 10);
        const savedUser = await User.create({
          username: username,
          password: hashed,
          email: email,
        });
        const token = jwt.sign({ username, email }, process.env.JWT_SECRET);
        res.status(200).json(new ApiResponse(200, token, "User Registered"));
      }
    } catch (err) {
      res.status(500).json({
        message: "Error signing up",
        success: false,
        error: err,
      });
    }
  };