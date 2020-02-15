import 'package:flutter/material.dart';

void main() => runApp(MyApp());

class MyApp extends StatefulWidget {
  @override
  State<StatefulWidget> createState() {
    // TODO: implement createState
    return _MyAppState();
  }
}
class _MyAppState extends State<MyApp>{
// This widget is the root of your application.
    List<String> options = ["Tiger", "Apple","Lion","Peacock"];
    List<String> images =
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(appBar: AppBar(
          title: Text('Annodata')),
          body:Column(
              children: <Widget>[
           Image(
          image: AssetImage("assets/tiger.jpg"),
             height: 300,
             width: 300,
             //color: Colors.red,
             //colorBlendMode: BlendMode.darken,
             fit: BoxFit.fitWidth, ),
           DropdownButton(
          hint: Text('Please choose an option'
          ,style: TextStyle(fontSize: 28)), // Not necessary for Option 1
          onChanged:(_){},
              items: options.map((String option) {
    return new DropdownMenuItem<String>(
      value:option,
    child: new Text(option)
    );
    }
           ).toList()

          )

      ,
           Row(
               mainAxisAlignment: MainAxisAlignment.spaceAround,
             children: <Widget>[
               RaisedButton(
                 color: Colors.blue,
                 child: Text("Skip",
                   style: TextStyle(fontSize: 28)),
                 onPressed: null
               ),
               RaisedButton(color: Colors.blue,
                 child: Text("Next",
                     style: TextStyle(fontSize: 28)),
                 onPressed: null
               )


             ]
           )   ])

    )
    );

    }
  }