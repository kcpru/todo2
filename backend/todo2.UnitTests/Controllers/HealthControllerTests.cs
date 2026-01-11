using Microsoft.AspNetCore.Mvc;
using todo2.Controllers;
using todo2.UnitTests.TestInfrastructure;

namespace todo2.UnitTests.Controllers;

[TestClass]
public class HealthControllerTests
{
    [TestMethod]
    public void GivenController_WhenGet_ThenReturnsOkWithStatusOk()
    {
        var sut = new HealthController(new FakeLogger<HealthController>());

        var result = sut.Get();

        var ok = result as OkObjectResult;
        Assert.IsNotNull(ok);

        var statusProp = ok.Value!.GetType().GetProperty("status");
        Assert.IsNotNull(statusProp);
        Assert.AreEqual("ok", statusProp.GetValue(ok.Value)?.ToString());
    }
}
